# PowerShell script para iniciar a aplicação Pizzaria
Write-Host "🚀 Iniciando Pizzaria - Aplicação Full Stack (Windows)" -ForegroundColor Green
Write-Host "=====================================================" -ForegroundColor Green

# Verificar se o arquivo .env existe
if (-not (Test-Path ".env")) {
    Write-Host "❌ Arquivo .env não encontrado!" -ForegroundColor Red
    Write-Host "📝 Crie um arquivo .env com as seguintes variáveis:" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "POSTGRES_DB=pizzaria_db" -ForegroundColor Cyan
    Write-Host "POSTGRES_USER=pizzaria_user" -ForegroundColor Cyan
    Write-Host "POSTGRES_PASSWORD=pizzaria_password" -ForegroundColor Cyan
    Write-Host "POSTGRES_HOST=db" -ForegroundColor Cyan
    Write-Host "POSTGRES_PORT=5432" -ForegroundColor Cyan
    Write-Host "DJANGO_SUPERUSER_USERNAME=admin" -ForegroundColor Cyan
    Write-Host "DJANGO_SUPERUSER_EMAIL=admin@email.com" -ForegroundColor Cyan
    Write-Host "DJANGO_SUPERUSER_PASSWORD=admin@123" -ForegroundColor Cyan
    Write-Host "SECRET_KEY=your-secret-key-here" -ForegroundColor Cyan
    Write-Host "DEBUG=True" -ForegroundColor Cyan
    Write-Host "ALLOWED_HOSTS=localhost,127.0.0.1" -ForegroundColor Cyan
    Write-Host "API_URL=http://localhost/api" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "💡 Exemplo de comando para criar o arquivo:" -ForegroundColor Yellow
    Write-Host "New-Item -Path .env -ItemType File" -ForegroundColor Gray
    Write-Host "Add-Content .env 'POSTGRES_DB=pizzaria_db'" -ForegroundColor Gray
    Write-Host "Add-Content .env 'POSTGRES_USER=pizzaria_user'" -ForegroundColor Gray
    Write-Host "Add-Content .env 'POSTGRES_PASSWORD=pizzaria_password'" -ForegroundColor Gray
    Write-Host "Add-Content .env 'POSTGRES_HOST=db'" -ForegroundColor Gray
    Write-Host "Add-Content .env 'POSTGRES_PORT=5432'" -ForegroundColor Gray
    Write-Host "Add-Content .env 'DJANGO_SUPERUSER_USERNAME=admin'" -ForegroundColor Gray
    Write-Host "Add-Content .env 'DJANGO_SUPERUSER_EMAIL=admin@email.com'" -ForegroundColor Gray
    Write-Host "Add-Content .env 'DJANGO_SUPERUSER_PASSWORD=admin@123'" -ForegroundColor Gray
    Write-Host "Add-Content .env 'SECRET_KEY=django-insecure-your-secret-key-here'" -ForegroundColor Gray
    Write-Host "Add-Content .env 'DEBUG=True'" -ForegroundColor Gray
    Write-Host "Add-Content .env 'ALLOWED_HOSTS=localhost,127.0.0.1'" -ForegroundColor Gray
    Write-Host "Add-Content .env 'API_URL=http://localhost/api'" -ForegroundColor Gray
    Write-Host ""
    exit 1
}

Write-Host "✅ Arquivo .env encontrado" -ForegroundColor Green
Write-Host "🔧 Construindo e iniciando os serviços..." -ForegroundColor Yellow

# Parar containers existentes
Write-Host "🛑 Parando containers existentes..." -ForegroundColor Yellow
docker-compose down

# Limpar imagens antigas (opcional)
Write-Host "🧹 Limpando imagens antigas..." -ForegroundColor Yellow
docker system prune -f

# Construir e iniciar serviços
Write-Host "🏗️  Construindo e iniciando serviços..." -ForegroundColor Yellow
docker-compose up --build -d

Write-Host "⏳ Aguardando serviços iniciarem..." -ForegroundColor Yellow
Start-Sleep -Seconds 15

# Verificar status dos containers
Write-Host "📊 Status dos containers:" -ForegroundColor Cyan
docker-compose ps

# Verificar se todos os containers estão rodando
$containers = docker-compose ps --format "table {{.Name}}\t{{.Status}}"
if ($containers -match "Up") {
    Write-Host ""
    Write-Host "🎉 Aplicação iniciada com sucesso!" -ForegroundColor Green
    Write-Host ""
    Write-Host "🌐 Acessos:" -ForegroundColor Cyan
    Write-Host "   Frontend: http://localhost" -ForegroundColor White
    Write-Host "   API: http://localhost/api" -ForegroundColor White
    Write-Host "   Admin: http://localhost/admin" -ForegroundColor White
    Write-Host "   Banco: localhost:5432" -ForegroundColor White
    Write-Host ""
    Write-Host "👤 Credenciais do Admin:" -ForegroundColor Cyan
    Write-Host "   Usuário: admin" -ForegroundColor White
    Write-Host "   Email: admin@email.com" -ForegroundColor White
    Write-Host "   Senha: admin@123" -ForegroundColor White
    Write-Host ""
    Write-Host "📝 Comandos úteis:" -ForegroundColor Cyan
    Write-Host "   Ver logs: docker-compose logs -f" -ForegroundColor Gray
    Write-Host "   Parar: docker-compose down" -ForegroundColor Gray
    Write-Host "   Reconstruir: docker-compose up --build" -ForegroundColor Gray
    Write-Host "   Acessar backend: docker-compose exec backend bash" -ForegroundColor Gray
    Write-Host "   Acessar banco: docker-compose exec db psql -U pizzaria_user -d pizzaria_db" -ForegroundColor Gray
    Write-Host ""
    Write-Host "🔍 Para ver logs em tempo real:" -ForegroundColor Cyan
    Write-Host "   docker-compose logs -f" -ForegroundColor Gray
} else {
    Write-Host "❌ Erro ao iniciar os serviços!" -ForegroundColor Red
    Write-Host "📋 Verificando logs..." -ForegroundColor Yellow
    docker-compose logs
} 