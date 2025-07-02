from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Q
from .models import Pizza, Pedido, ItemPedido
from .serializers import (
    PizzaSerializer, PedidoSerializer, PedidoCreateSerializer, 
    PedidoUpdateSerializer, ItemPedidoSerializer
)

class PizzaViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet para pizzas (apenas leitura)
    GET /api/pizzas/ - Lista todas as pizzas ativas
    GET /api/pizzas/{id}/ - Detalhes de uma pizza
    """
    queryset = Pizza.objects.filter(ativo=True)
    serializer_class = PizzaSerializer
    permission_classes = [permissions.AllowAny]  # Público
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['categoria']
    search_fields = ['nome', 'descricao']
    ordering = ['categoria', 'nome']

class PedidoViewSet(viewsets.ModelViewSet):
    """
    ViewSet para pedidos
    GET /api/pedidos/ - Lista pedidos do usuário logado
    POST /api/pedidos/ - Cria novo pedido
    GET /api/pedidos/{id}/ - Detalhes de um pedido
    PATCH /api/pedidos/{id}/ - Atualiza status do pedido
    DELETE /api/pedidos/{id}/ - Cancela pedido
    """
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['status']
    ordering = ['-data_criacao']
    
    def get_queryset(self):
        """
        Retorna apenas pedidos do usuário logado
        """
        return Pedido.objects.filter(usuario=self.request.user)
    
    def get_serializer_class(self):
        """
        Retorna o serializer apropriado baseado na ação
        """
        if self.action == 'create':
            return PedidoCreateSerializer
        elif self.action in ['update', 'partial_update']:
            return PedidoUpdateSerializer
        return PedidoSerializer
    
    def perform_create(self, serializer):
        """
        Associa o pedido ao usuário logado
        """
        serializer.save(usuario=self.request.user)
    
    def destroy(self, request, *args, **kwargs):
        """
        Cancela o pedido em vez de deletar
        """
        pedido = self.get_object()
        
        if pedido.status in ['ENTREGUE', 'CANCELADO']:
            return Response(
                {'error': 'Não é possível cancelar um pedido já entregue ou cancelado.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        pedido.status = 'CANCELADO'
        pedido.save()
        
        return Response(
            {'message': 'Pedido cancelado com sucesso.'},
            status=status.HTTP_200_OK
        )
    
    @action(detail=False, methods=['get'], permission_classes=[permissions.IsAdminUser])
    def todos(self, request):
        """
        Endpoint para listar todos os pedidos (apenas admin)
        GET /api/pedidos/todos/
        """
        queryset = Pedido.objects.all()
        
        # Filtros opcionais
        status_filter = request.query_params.get('status')
        usuario_filter = request.query_params.get('usuario')
        
        if status_filter:
            queryset = queryset.filter(status=status_filter)
        
        if usuario_filter:
            queryset = queryset.filter(
                Q(usuario__first_name__icontains=usuario_filter) |
                Q(usuario__last_name__icontains=usuario_filter) |
                Q(usuario__email__icontains=usuario_filter)
            )
        
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def estatisticas(self, request):
        """
        Endpoint para estatísticas dos pedidos do usuário
        GET /api/pedidos/estatisticas/
        """
        user_pedidos = self.get_queryset()
        
        stats = {
            'total_pedidos': user_pedidos.count(),
            'pedidos_pendentes': user_pedidos.filter(status='PENDENTE').count(),
            'pedidos_pagos': user_pedidos.filter(status='PAGO').count(),
            'pedidos_preparando': user_pedidos.filter(status='PREPARANDO').count(),
            'pedidos_entregues': user_pedidos.filter(status='ENTREGUE').count(),
            'pedidos_cancelados': user_pedidos.filter(status='CANCELADO').count(),
            'valor_total_gasto': sum(
                p.valor_total for p in user_pedidos.filter(
                    status__in=['PAGO', 'PREPARANDO', 'ENTREGUE']
                )
            ),
        }
        
        return Response(stats)

class ItemPedidoViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet para itens de pedido (apenas leitura)
    """
    serializer_class = ItemPedidoSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        """
        Retorna apenas itens dos pedidos do usuário logado
        """
        return ItemPedido.objects.filter(pedido__usuario=self.request.user)