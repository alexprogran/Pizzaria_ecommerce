from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User, Pizza, Pedido, ItemPedido

@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ('email', 'first_name', 'last_name', 'is_staff', 'date_joined')
    list_filter = ('is_staff', 'is_superuser', 'is_active', 'date_joined')
    search_fields = ('email', 'first_name', 'last_name')
    ordering = ('email',)
    
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Informações Pessoais', {'fields': ('first_name', 'last_name', 'username')}),
        ('Permissões', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Datas Importantes', {'fields': ('last_login', 'date_joined')}),
    )
    
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'first_name', 'last_name', 'username', 'password1', 'password2'),
        }),
    )

@admin.register(Pizza)
class PizzaAdmin(admin.ModelAdmin):
    list_display = ('nome', 'categoria', 'preco', 'ativo', 'data_criacao')
    list_filter = ('categoria', 'ativo', 'data_criacao')
    search_fields = ('nome', 'descricao')
    list_editable = ('preco', 'ativo')
    ordering = ('categoria', 'nome')
    
    fieldsets = (
        ('Informações Básicas', {
            'fields': ('nome', 'descricao', 'categoria')
        }),
        ('Preço e Disponibilidade', {
            'fields': ('preco', 'ativo')
        }),
        ('Imagem', {
            'fields': ('imagem',)
        }),
    )

class ItemPedidoInline(admin.TabularInline):
    model = ItemPedido
    extra = 0
    readonly_fields = ('subtotal',)
    
    def subtotal(self, obj):
        return f"R$ {obj.subtotal:.2f}" if obj.id else "-"
    subtotal.short_description = 'Subtotal'

@admin.register(Pedido)
class PedidoAdmin(admin.ModelAdmin):
    list_display = ('id', 'usuario', 'valor_total', 'status', 'data_criacao')
    list_filter = ('status', 'data_criacao')
    search_fields = ('usuario__email', 'usuario__first_name', 'usuario__last_name')
    list_editable = ('status',)
    ordering = ('-data_criacao',)
    inlines = [ItemPedidoInline]
    
    fieldsets = (
        ('Informações do Pedido', {
            'fields': ('usuario', 'status', 'valor_total')
        }),
        ('Observações', {
            'fields': ('observacoes',),
            'classes': ('collapse',)
        }),
        ('Datas', {
            'fields': ('data_criacao', 'data_atualizacao'),
            'classes': ('collapse',)
        }),
    )
    
    readonly_fields = ('data_criacao', 'data_atualizacao')
    
    def save_model(self, request, obj, form, change):
        super().save_model(request, obj, form, change)
        # Recalcula o total após salvar
        obj.calcular_total()
        obj.save()

@admin.register(ItemPedido)
class ItemPedidoAdmin(admin.ModelAdmin):
    list_display = ('pedido', 'pizza', 'quantidade', 'preco_unitario', 'subtotal')
    list_filter = ('pedido__status', 'pizza__categoria')
    search_fields = ('pedido__id', 'pizza__nome', 'pedido__usuario__email')
    
    def subtotal(self, obj):
        return f"R$ {obj.subtotal:.2f}"
    subtotal.short_description = 'Subtotal'