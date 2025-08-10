#!/bin/bash

echo "🚀 Iniciando build da aplicação Pizzaria..."

# Parar containers existentes
echo "🛑 Parando containers existentes..."
docker compose down

# Remover imagens antigas (opcional)
echo "🧹 Removendo imagens antigas..."
docker compose down --rmi all

# Fazer build das imagens
echo "🔨 Fazendo build das imagens..."
docker compose build --no-cache

# Subir os serviços
echo "⬆️ Subindo os serviços..."
docker compose up -d

# Aguardar um pouco para os serviços inicializarem
echo "⏳ Aguardando inicialização dos serviços..."
sleep 10

# Verificar status dos containers
echo "📊 Status dos containers:"
docker compose ps

echo "✅ Build concluído!"
echo "🌐 Acesse a aplicação em: http://localhost"
echo "🔧 API Django em: http://localhost/api/"
echo "👨‍💼 Admin Django em: http://localhost/admin/" 