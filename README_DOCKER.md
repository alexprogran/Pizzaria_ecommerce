# 🍕 Pizzaria - Docker Setup

Este projeto está configurado para rodar com Docker Compose, incluindo:
- **Frontend React** (build estático servido pelo nginx)
- **Backend Django** (Gunicorn)
- **PostgreSQL** (banco de dados)
- **Nginx** (proxy reverso e servidor de arquivos estáticos)

## 🚀 Como executar

### Opção 1: Script automatizado
```bash
chmod +x build.sh
./build.sh
```

### Opção 2: Comandos manuais
```bash
# Parar containers existentes
docker compose down

# Fazer build das imagens
docker compose build --no-cache

# Subir os serviços
docker compose up -d
```

## 📁 Estrutura dos serviços

### Frontend (React)
- **Porta**: Build estático servido pelo nginx
- **Arquivos**: `./frontend/dist` montado no nginx
- **Comando**: `npm run build`

### Backend (Django)
- **Porta**: 8000
- **Framework**: Django + Gunicorn
- **Banco**: PostgreSQL (psycopg2-binary)
- **Arquivos estáticos**: Volume compartilhado com nginx

### PostgreSQL
- **Porta**: 5432
- **Database**: pizzaria_db
- **User**: pizzaria_user
- **Password**: pizzaria_password

### Nginx
- **Porta**: 80
- **Função**: Proxy reverso + servidor de arquivos estáticos

## 🔧 Configurações

### Variáveis de ambiente
As variáveis estão definidas diretamente no `docker-compose.yml`:
- `POSTGRES_DB=pizzaria_db`
- `POSTGRES_USER=pizzaria_user`
- `POSTGRES_PASSWORD=pizzaria_password`

### Volumes
- `postgres_data`: Dados do PostgreSQL
- `static_volume`: Arquivos estáticos do Django
- `media_volume`: Arquivos de mídia do Django

## 🌐 URLs de acesso

- **Aplicação principal**: http://localhost
- **API Django**: http://localhost/api/
- **Admin Django**: http://localhost/admin/
- **Health check**: http://localhost/health/

## 🔍 Troubleshooting

### Problemas comuns:

1. **Dependências Python não instalam**
   - ✅ Corrigido: Adicionadas dependências necessárias no Dockerfile do backend

2. **Variáveis de ambiente não definidas**
   - ✅ Corrigido: Variáveis definidas diretamente no docker-compose.yml

3. **Build do frontend falha**
   - Verifique se o `package.json` existe
   - Execute `docker compose logs frontend`

4. **Backend não conecta ao banco**
   - Aguarde o healthcheck do PostgreSQL
   - Verifique logs: `docker compose logs backend`

### Comandos úteis:

```bash
# Ver logs de todos os serviços
docker compose logs

# Ver logs de um serviço específico
docker compose logs backend
docker compose logs frontend
docker compose logs nginx

# Entrar em um container
docker compose exec backend bash
docker compose exec frontend bash

# Verificar status dos containers
docker compose ps

# Parar todos os serviços
docker compose down

# Parar e remover volumes
docker compose down -v
```

## 🛠️ Desenvolvimento

### Para desenvolvimento local:
1. O frontend está configurado com hot reload
2. O backend está configurado com volumes para desenvolvimento
3. As mudanças são refletidas automaticamente

### Para produção:
1. O frontend faz build estático
2. O nginx serve os arquivos estáticos
3. O backend roda com Gunicorn

## 📝 Notas importantes

- O superuser do Django é criado automaticamente:
  - **Username**: admin
  - **Email**: admin@email.com
  - **Password**: admin@123

- Os arquivos estáticos do Django são coletados automaticamente
- As migrações são aplicadas automaticamente
- O healthcheck garante que o PostgreSQL esteja pronto antes do backend iniciar
- **Banco de dados**: PostgreSQL com psycopg2-binary (MySQL removido) 