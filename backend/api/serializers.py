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
        fields = ('id', 'email', 'username', 'password')

class UserSerializer(serializers.ModelSerializer):
    """
    Serializer para dados do usuário
    """
    class Meta:
        model = User
        fields = ('id', 'email', 'username')
        read_only_fields = ('id', 'email')

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
    usuario_nome = serializers.CharField(source='usuario.full_name', read_only=True)
    usuario_email = serializers.CharField(source='usuario.email', read_only=True)
    itens = ItemPedidoSerializer(many=True, read_only=True)
    
    class Meta:
        model = Pedido
        fields = (
            'id', 'usuario', 'usuario_nome', 'usuario_email',
            'valor_total', 'status', 'observacoes', 
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
    
    def create(self, validated_data):
        itens_data = validated_data.pop('itens')
        usuario = self.context['request'].user
        
        # Criar o pedido
        pedido = Pedido.objects.create(
            usuario=usuario,
            valor_total=0,  # Será calculado depois
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
        
        # Calcular e salvar o total
        pedido.calcular_total()
        pedido.save()
        
        return pedido
    
    def validate_itens(self, value):
        """
        Valida se há pelo menos um item no pedido
        """
        if not value:
            raise serializers.ValidationError("O pedido deve ter pelo menos um item.")
        
        # Verifica se todas as pizzas estão ativas
        for item in value:
            if not item['pizza'].ativo:
                raise serializers.ValidationError(
                    f"A pizza '{item['pizza'].nome}' não está disponível."
                )
        
        return value

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