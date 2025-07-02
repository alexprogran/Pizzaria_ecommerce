# Backend da Pizzaria - Django REST API

Este é o backend da aplicação de pizzaria, construído com Django e Django REST Framework.

## 🚀 Funcionalidades

- **Autenticação JWT** com Djoser
- **CRUD de Pizzas** (listagem pública)
- **Gerenciamento de Pedidos** (autenticado)
- **Sistema de Carrinho** integrado
- **Painel Administrativo** Django
- **API REST** completa

## 📦 Instalação

1. **Criar ambiente virtual:**
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Linux/Mac
# ou
venv\Scripts\activate  # Windows
```

2. **Instalar dependências:**
```bash
pip install -r requirements.txt
```

3. **Configurar variáveis de ambiente:**
```bash
cp .env.example .env
# Edite o arquivo .env com suas configurações
```

4. **Executar migrações:**
```bash
python manage.py makemigrations
python manage.py migrate
```

5. **Criar superusuário:**
```bash
python manage.py createsuperuser
```

6. **Popular banco com pizzas de exemplo:**
```bash
python manage.py populate_pizzas
```

7. **Executar servidor:**
```bash
python manage.py runserver
```

## 🔗 Endpoints da API

### Autenticação (Djoser + JWT)
- `POST /auth/users/` - Registro de usuário
- `POST /auth/jwt/create/` - Login (obter token)
- `POST /auth/jwt/refresh/` - Refresh token
- `GET /auth/users/me/` - Dados do usuário logado

### Pizzas
- `GET /api/pizzas/` - Listar pizzas (público)
- `GET /api/pizzas/{id}/` - Detalhes da pizza

### Pedidos (Autenticado)
- `GET /api/pedidos/` - Listar pedidos do usuário
- `POST /api/pedidos/` - Criar novo pedido
- `GET /api/pedidos/{id}/` - Detalhes do pedido
- `PATCH /api/pedidos/{id}/` - Atualizar status
- `DELETE /api/pedidos/{id}/` - Cancelar pedido
- `GET /api/pedidos/estatisticas/` - Estatísticas do usuário
- `GET /api/pedidos/todos/` - Todos os pedidos (admin)

## 🔐 Autenticação

Para endpoints protegidos, inclua o token JWT no header:

```
Authorization: Bearer <seu_token_jwt>
```

## 📊 Modelos de Dados

### User (Usuário)
- email (único)
- first_name, last_name
- Autenticação via email

### Pizza
- nome, descrição, preço
- categoria, imagem (URL)
- ativo (boolean)

### Pedido
- usuário (FK)
- valor_total (calculado)
- status (PENDENTE, PAGO, PREPARANDO, ENTREGUE, CANCELADO)
- data_criação

### ItemPedido
- pedido (FK), pizza (FK)
- quantidade, preço_unitário
- subtotal (calculado)

## 🛡️ Permissões

- **Pizzas**: Público (apenas leitura)
- **Pedidos**: Usuários autenticados (apenas seus pedidos)
- **Admin**: Acesso total via Django Admin

## 🔧 Configurações CORS

O backend está configurado para aceitar requisições do frontend React:
- `http://localhost:3000` (Create React App)
- `http://localhost:5173` (Vite)

## 📝 Exemplo de Uso

### 1. Registrar usuário:
```bash
curl -X POST http://localhost:8000/auth/users/ \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "username": "user123",
    "first_name": "João",
    "last_name": "Silva",
    "password": "senha123"
  }'
```

### 2. Fazer login:
```bash
curl -X POST http://localhost:8000/auth/jwt/create/ \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "senha123"
  }'
```

### 3. Criar pedido:
```bash
curl -X POST http://localhost:8000/api/pedidos/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <seu_token>" \
  -d '{
    "observacoes": "Sem cebola",
    "itens": [
      {"pizza": 1, "quantidade": 2},
      {"pizza": 3, "quantidade": 1}
    ]
  }'
```

## 🚀 Deploy

Para produção, configure:
- `DEBUG = False`
- `SECRET_KEY` segura
- Banco de dados PostgreSQL
- Servidor web (Nginx + Gunicorn)
- HTTPS habilitado