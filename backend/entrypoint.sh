#!/bin/bash

set -e

# Função para verificar se o MySQL está pronto
mysql_ready() {
python << END
import sys
import MySQLdb
try:
    MySQLdb.connect(
        db="${MYSQL_DATABASE}",
        user="${MYSQL_USER}",
        passwd="${MYSQL_PASSWORD}",
        host="${MYSQL_HOST}",
        port=int("${MYSQL_PORT}")
    )
except MySQLdb.Error:
    sys.exit(1)
sys.exit(0)
END
}

# Espera até o MySQL estar disponível
until mysql_ready; do
  echo "Waiting for MySQL to become available..."
  sleep 1
done
echo "MySQL is available"

echo "Applying migrations..."
python manage.py migrate

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
