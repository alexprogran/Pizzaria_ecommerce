from rest_framework import serializers
from django.contrib.auth import get_user_model
from djoser.serializers import UserCreateSerializer as BaseUserCreateSerializer
from .models import Pizza, Pedido, ItemPedido

User = get_user_model()

class UserCreateSerializer(BaseUserCreateSerializer):
    """
    Serializer para criação de usuários
    """
    class Meta(BaseUserCreateSerializer.Meta):
        model = User
        fields = ('id', 'email', 'username', 'password', 'first_name', 'last_name')
        
    def create(self, validated_data):
        """
        Sobrescreve o método create para garantir que o username seja o email se não for fornecido
        """
        if not validated_data.get('username'):
            validated_data['username'] = validated_data.get('email')
        return super().create(validated_data)

class UserSerializer(serializers.ModelSerializer):
    """
    Serializer para dados do usuário
    """
    class Meta:
        model = User
        fields = ('id', 'email', 'username', 'is_staff')
        read_only_fields = ('id', 'email', 'is_staff')

class PizzaSerializer(serializers.ModelSerializer):
    """
    Serializer para pizzas
    """
    class Meta:
        model = Pizza
        fields = (
            'id', 'nome', 'descricao', 'preco', 'imagem', 
            'categoria', 'ativo', 'data_criacao'
        )
        read_only_fields = ('id', 'data_criacao')

class ItemPedidoSerializer(serializers.ModelSerializer):
    """
    Serializer para itens do pedido
    """
    pizza_nome = serializers.CharField(source='pizza.nome', read_only=True)
    pizza_categoria = serializers.CharField(source='pizza.categoria', read_only=True)
    subtotal = serializers.ReadOnlyField()
    
    class Meta:
        model = ItemPedido
        fields = (
            'id', 'pizza', 'pizza_nome', 'pizza_categoria', 
            'quantidade', 'preco_unitario', 'subtotal'
        )
        read_only_fields = ('id', 'subtotal')

class ItemPedidoCreateSerializer(serializers.ModelSerializer):
    """
    Serializer para criação de itens do pedido
    """
    class Meta:
        model = ItemPedido
        fields = ('pizza', 'quantidade')

class PedidoSerializer(serializers.ModelSerializer):
    """
    Serializer para visualização de pedidos
    """
    usuario = UserSerializer(read_only=True)
    itens = ItemPedidoSerializer(many=True, read_only=True)
    
    class Meta:
        model = Pedido
        fields = (
            'id', 'usuario', 'valor_total', 'status', 'observacoes', 
            'data_criacao', 'data_atualizacao', 'itens'
        )
        read_only_fields = ('id', 'usuario', 'valor_total', 'data_criacao', 'data_atualizacao')

class PedidoCreateSerializer(serializers.ModelSerializer):
    """
    Serializer para criação de pedidos
    """
    itens = ItemPedidoCreateSerializer(many=True, write_only=True)
    
    class Meta:
        model = Pedido
        fields = ('observacoes', 'itens')
    
    def validate(self, data):
        """
        Validação adicional dos dados
        """
        itens_data = data.get('itens', [])
        
        if not itens_data:
            raise serializers.ValidationError({
                'itens': "O pedido deve ter pelo menos um item."
            })
        
        # Validar cada item
        for item in itens_data:
            if not isinstance(item.get('quantidade'), int) or item.get('quantidade') < 1:
                raise serializers.ValidationError({
                    'itens': f"Quantidade inválida para o item: {item}"
                })
            
            pizza = item.get('pizza')
            if not pizza:
                raise serializers.ValidationError({
                    'itens': f"Pizza não especificada para o item: {item}"
                })
            
            if not pizza.ativo:
                raise serializers.ValidationError({
                    'itens': f"A pizza '{pizza.nome}' não está disponível."
                })
        
        return data
    
    def create(self, validated_data):
        itens_data = validated_data.pop('itens')
        
        try:
            # Calcular o valor total antes de criar o pedido
            valor_total = sum(
                item_data['quantidade'] * item_data['pizza'].preco
                for item_data in itens_data
            )
            
            # Criar o pedido com o valor total calculado
            pedido = Pedido.objects.create(
                valor_total=valor_total,
                **validated_data
            )
            
            # Criar os itens do pedido
            for item_data in itens_data:
                pizza = item_data['pizza']
                ItemPedido.objects.create(
                    pedido=pedido,
                    pizza=pizza,
                    quantidade=item_data['quantidade'],
                    preco_unitario=pizza.preco  # Congela o preço atual
                )
            
            return pedido
            
        except Exception as e:
            # Se algo der errado, registrar o erro e relançar
            import logging
            logger = logging.getLogger(__name__)
            logger.error(f"Erro ao criar pedido: {str(e)}")
            logger.error(f"Dados do pedido: {validated_data}")
            logger.error(f"Itens do pedido: {itens_data}")
            raise

class PedidoUpdateSerializer(serializers.ModelSerializer):
    """
    Serializer para atualização de status do pedido
    """
    class Meta:
        model = Pedido
        fields = ('status', 'observacoes')
    
    def validate_status(self, value):
        """
        Valida transições de status válidas
        """
        if self.instance:
            current_status = self.instance.status
            
            # Regras de transição de status
            valid_transitions = {
                'PENDENTE': ['PAGO', 'CANCELADO'],
                'PAGO': ['PREPARANDO', 'CANCELADO'],
                'PREPARANDO': ['ENTREGUE'],
                'ENTREGUE': [],  # Status final
                'CANCELADO': [],  # Status final
            }
            
            if value not in valid_transitions.get(current_status, []):
                raise serializers.ValidationError(
                    f"Não é possível alterar status de '{current_status}' para '{value}'"
                )
        
        return value