#!/bin/bash

echo "🚀 Iniciando Pizzaria - Aplicação Full Stack (WSL)"
echo "=================================================="

# Verificar se estamos no WSL
if [[ -n "$WSL_DISTRO_NAME" ]]; then
    echo "✅ Executando no WSL: $WSL_DISTRO_NAME"
else
    echo "⚠️  Executando fora do WSL"
fi

# Verificar se o Docker está rodando
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker não está rodando!"
    echo "💡 Inicie o Docker Desktop no Windows e tente novamente"
    exit 1
fi

echo "✅ Docker está rodando"

# Verificar se o arquivo .env existe
if [ ! -f .env ]; then
    echo "❌ Arquivo .env não encontrado!"
    echo "📝 Crie um arquivo .env com as seguintes variáveis:"
    echo ""
    echo "POSTGRES_DB=pizzaria_db"
    echo "POSTGRES_USER=pizzaria_user"
    echo "POSTGRES_PASSWORD=pizzaria_password"
    echo "POSTGRES_HOST=db"
    echo "POSTGRES_PORT=5432"
    echo "DJANGO_SUPERUSER_USERNAME=admin"
    echo "DJANGO_SUPERUSER_EMAIL=admin@email.com"
    echo "DJANGO_SUPERUSER_PASSWORD=admin@123"
    echo "SECRET_KEY=your-secret-key-here"
    echo "DEBUG=True"
    echo "ALLOWED_HOSTS=localhost,127.0.0.1"
    echo "API_URL=http://localhost/api"
    echo ""
    echo "💡 Exemplo de comando para criar o arquivo:"
    echo "cat > .env << 'EOF'"
    echo "POSTGRES_DB=pizzaria_db"
    echo "POSTGRES_USER=pizzaria_user"
    echo "POSTGRES_PASSWORD=pizzaria_password"
    echo "POSTGRES_HOST=db"
    echo "POSTGRES_PORT=5432"
    echo "DJANGO_SUPERUSER_USERNAME=admin"
    echo "DJANGO_SUPERUSER_EMAIL=admin@email.com"
    echo "DJANGO_SUPERUSER_PASSWORD=admin@123"
    echo "SECRET_KEY=django-insecure-your-secret-key-here"
    echo "DEBUG=True"
    echo "ALLOWED_HOSTS=localhost,127.0.0.1"
    echo "API_URL=http://localhost/api"
    echo "EOF"
    echo ""
    exit 1
fi

echo "✅ Arquivo .env encontrado"
echo "🔧 Construindo e iniciando os serviços..."

# Parar containers existentes
echo "🛑 Parando containers existentes..."
docker-compose down

# Limpar imagens antigas (opcional)
echo "🧹 Limpando imagens antigas..."
docker system prune -f

# Construir e iniciar serviços
echo "🏗️  Construindo e iniciando serviços..."
docker-compose up --build -d

echo "⏳ Aguardando serviços iniciarem..."
sleep 15

# Verificar status dos containers
echo "📊 Status dos containers:"
docker-compose ps

# Verificar se todos os containers estão rodando
if docker-compose ps | grep -q "Up"; then
    echo ""
    echo "🎉 Aplicação iniciada com sucesso!"
    echo ""
    echo "🌐 Acessos:"
    echo "   Frontend: http://localhost"
    echo "   API: http://localhost/api"
    echo "   Admin: http://localhost/admin"
    echo "   Banco: localhost:5432"
    echo ""
    echo "👤 Credenciais do Admin:"
    echo "   Usuário: admin"
    echo "   Email: admin@email.com"
    echo "   Senha: admin@123"
    echo ""
    echo "📝 Comandos úteis:"
    echo "   Ver logs: docker-compose logs -f"
    echo "   Parar: docker-compose down"
    echo "   Reconstruir: docker-compose up --build"
    echo "   Acessar backend: docker-compose exec backend bash"
    echo "   Acessar banco: docker-compose exec db psql -U pizzaria_user -d pizzaria_db"
    echo ""
    echo "🔍 Para ver logs em tempo real:"
    echo "   docker-compose logs -f"
else
    echo "❌ Erro ao iniciar os serviços!"
    echo "📋 Verificando logs..."
    docker-compose logs
fi 