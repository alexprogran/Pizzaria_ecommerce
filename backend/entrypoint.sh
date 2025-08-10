#!/bin/bash

set -e

# Função para verificar se o PostgreSQL está pronto
postgres_ready() {
python << END
import sys
import psycopg2
try:
    psycopg2.connect(
        dbname="${POSTGRES_DB}",
        user="${POSTGRES_USER}",
        password="${POSTGRES_PASSWORD}",
        host="${POSTGRES_HOST}",
        port="${POSTGRES_PORT}"
    )
except psycopg2.Error:
    sys.exit(1)
sys.exit(0)
END
}

# Espera até o PostgreSQL estar disponível
until postgres_ready; do
  echo "Waiting for PostgreSQL to become available..."
  sleep 1
done
echo "PostgreSQL is available"

echo "Applying migrations..."
python manage.py migrate

echo "Collecting static files..."
python manage.py collectstatic --noinput

echo "Creating superuser..."
export DJANGO_SUPERUSER_USERNAME=admin
export DJANGO_SUPERUSER_EMAIL=admin@email.com
export DJANGO_SUPERUSER_PASSWORD=admin@123

python manage.py shell << END
from django.contrib.auth import get_user_model
User = get_user_model()
if not User.objects.filter(username='${DJANGO_SUPERUSER_USERNAME}').exists():
    User.objects.create_superuser(
        username='${DJANGO_SUPERUSER_USERNAME}',
        email='${DJANGO_SUPERUSER_EMAIL}',
        password='${DJANGO_SUPERUSER_PASSWORD}'
    )
END

echo "Verifying superuser creation..."
python manage.py shell -c "from django.contrib.auth import get_user_model; print('Superuser exists:', get_user_model().objects.filter(is_superuser=True).exists())"

echo "Starting Gunicorn server..."
exec gunicorn pizzaria_backend.wsgi:application --bind 0.0.0.0:8000 --workers 4 --timeout 120
