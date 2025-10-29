#!/bin/sh
set -e

echo "[backend] Waiting for Postgres via DATABASE_URL=${DATABASE_URL}"

python manage.py makemigrations iam
until python manage.py migrate --noinput; do
  echo "[backend] DB not ready yet, retrying in 2s..."
  sleep 2
done

echo "[backend] Collecting static..."
python manage.py collectstatic --noinput || true

echo "[backend] Creating initial superuser (if env is set)..."
python manage.py drf_create_initial_superuser || true

echo "[backend] Starting Gunicorn..."
exec gunicorn rbac_core.wsgi:application -b 0.0.0.0:8000 --workers 3
