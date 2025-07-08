from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.core.validators import MinValueValidator
from decimal import Decimal

class UserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError("O campo de e-mail é obrigatório")
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError("Superusuário precisa ter is_staff=True.")
        if extra_fields.get('is_superuser') is not True:
            raise ValueError("Superusuário precisa ter is_superuser=True.")

        return self.create_user(email, password, **extra_fields)

class User(AbstractUser):
    """
    Modelo de usuário customizado
    """
    email = models.EmailField(unique=True)
    first_name = models.CharField(max_length=30, blank=True)
    last_name = models.CharField(max_length=30, blank=True)
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']
    
    objects = UserManager()
    
    def __str__(self):
        return f"{self.first_name} {self.last_name}"
    
    @property
    def full_name(self):
        return f"{self.first_name} {self.last_name}".strip()
    
    def save(self, *args, **kwargs):
        """
        Sobrescreve o método save para garantir que superusuários
        tenham is_staff=True
        """
        if self.is_superuser:
            self.is_staff = True
        super().save(*args, **kwargs)

class Pizza(models.Model):
    """
    Modelo para as pizzas do cardápio
    """
    CATEGORIA_CHOICES = [
        ('Tradicional', 'Tradicional'),
        ('Especial', 'Especial'),
        ('Vegetariana', 'Vegetariana'),
        ('Picante', 'Picante'),
        ('Doce', 'Doce'),
    ]
    
    nome = models.CharField(max_length=100)
    descricao = models.TextField()
    preco = models.DecimalField(
        max_digits=6, 
        decimal_places=2,
        validators=[MinValueValidator(Decimal('0.01'))]
    )
    imagem = models.URLField(
        help_text="URL da imagem da pizza"
    )
    categoria = models.CharField(
        max_length=20,
        choices=CATEGORIA_CHOICES,
        default='Tradicional'
    )
    ativo = models.BooleanField(default=True)
    data_criacao = models.DateTimeField(auto_now_add=True)
    data_atualizacao = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['categoria', 'nome']
        verbose_name = 'Pizza'
        verbose_name_plural = 'Pizzas'
    
    def __str__(self):
        return f"{self.nome} - R$ {self.preco}"

class Pedido(models.Model):
    """
    Modelo para os pedidos dos clientes
    """
    STATUS_CHOICES = [
        ('PENDENTE', 'Pendente'),
        ('PAGO', 'Pago'),
        ('PREPARANDO', 'Preparando'),
        ('ENTREGUE', 'Entregue'),
        ('CANCELADO', 'Cancelado'),
    ]
    
    usuario = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='pedidos'
    )
    valor_total = models.DecimalField(
        max_digits=8,
        decimal_places=2,
        validators=[MinValueValidator(Decimal('0.01'))]
    )
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='PENDENTE'
    )
    observacoes = models.TextField(blank=True, null=True)
    data_criacao = models.DateTimeField(auto_now_add=True)
    data_atualizacao = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-data_criacao']
        verbose_name = 'Pedido'
        verbose_name_plural = 'Pedidos'
    
    def __str__(self):
        return f"Pedido #{self.id} - {self.usuario.full_name} - R$ {self.valor_total}"
    
    def calcular_total(self):
        """
        Calcula o valor total do pedido baseado nos itens
        """
        total = sum(item.subtotal for item in self.itens.all())
        self.valor_total = total
        return total

class ItemPedido(models.Model):
    """
    Modelo para os itens de cada pedido (relação entre Pedido e Pizza)
    """
    pedido = models.ForeignKey(
        Pedido,
        on_delete=models.CASCADE,
        related_name='itens'
    )
    pizza = models.ForeignKey(
        Pizza,
        on_delete=models.CASCADE,
        related_name='itens_pedido'
    )
    quantidade = models.PositiveIntegerField(
        validators=[MinValueValidator(1)]
    )
    preco_unitario = models.DecimalField(
        max_digits=6,
        decimal_places=2,
        validators=[MinValueValidator(Decimal('0.01'))],
        help_text="Preço da pizza no momento do pedido"
    )
    
    class Meta:
        verbose_name = 'Item do Pedido'
        verbose_name_plural = 'Itens do Pedido'
        unique_together = ['pedido', 'pizza']
    
    def __str__(self):
        return f"{self.quantidade}x {self.pizza.nome} - R$ {self.subtotal}"
    
    @property
    def subtotal(self):
        """
        Calcula o subtotal do item (quantidade * preço unitário)
        """
        return self.quantidade * self.preco_unitario
    
    def save(self, *args, **kwargs):
        """
        Sobrescreve o save para definir o preço unitário automaticamente
        """
        if not self.preco_unitario:
            self.preco_unitario = self.pizza.preco
        super().save(*args, **kwargs)