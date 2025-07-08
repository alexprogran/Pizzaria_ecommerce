from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PizzaViewSet, PedidoViewSet, ItemPedidoViewSet

# Criar o router e registrar as viewsets
router = DefaultRouter()
router.register(r'pizzas', PizzaViewSet, basename='pizza')
router.register(r'pedidos', PedidoViewSet, basename='pedido')
router.register(r'itens-pedido', ItemPedidoViewSet, basename='itempedido')

urlpatterns = [
    path('', include(router.urls)),
]