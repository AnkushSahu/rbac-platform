# RBAC Platform (Django + DRF + React + Docker + Terraform + Ansible + Jenkins)

A production-grade starter for a **Role/Policy/Team** RBAC system with clean architecture,
tests, containerization, infrastructure-as-code, and CI/CD.

## Features
- **Django 5 + Django REST Framework** backend with PostgreSQL
- Entities: **Team**, **Role**, **Policy**, **TeamRole** , **RolePolicy** (many-to-many)
- CRUD APIs with validation 
- Token auth via **django-rest-framework-simplejwt**
- **CORS**, **Pagination**
- Unit & API tests using **pytest** + **pytest-django**
- **React (Vite)** frontend (minimal but functional)
- **Docker** for dev & prod, **docker-compose** for local
- **Jenkinsfile** for build/test/lint+typecheck/dockerize/deploy
- **Terraform** (AWS) to provision an EC2 host
- **Ansible** to deploy containers to the EC2 host

> Clone, configure `.env`, then run with Docker or deploy with Terraform+Ansible.

---

## Deployment 
- docker compose build --no-cache
- docker up -d
- docker compose logs -f frontend (frontend running logs)
- docker compose logs -f backend (backend running logs)
- docker compose down -v ( to kill all containers)

 

## API (selected endpoints)

- `POST /api/auth/token/` (JWT obtain), `POST /api/auth/token/refresh/`
- `GET|POST /api/teams/`, `GET|PUT|PATCH|DELETE /api/teams/{id}/`
- `GET|POST /api/roles/`, `GET|PUT|PATCH|DELETE /api/roles/{id}/`
- `GET|POST /api/policies/`, `GET|PUT|PATCH|DELETE /api/policies/{id}/`
- `GET|POST /api/memberships/`, `GET|PUT|PATCH|DELETE /api/memberships/{id}/`
- `GET|POST /api/role-policies/`, `GET|PUT|PATCH|DELETE /api/role-policies/{id}/`

### Policy model
Policies are JSON with `action`, `resource`, and optional `effect` (allow/deny). Example:
```json
{"action":"read","resource":"document","effect":"allow"}
```

---

## Best Practices baked in
- 12‑factor settings via env vars
- Database URL parsing
- `pre-commit` config (Black, isort, flake8)
- Typed code where helpful, validators & DRF serializers
- `pytest` with factory fixtures
- Readonly fields, unique constraints, defensive DB indexes
- Minimal, auditable CI with caching

---

## Repo Layout
```
backend/          # Django app (DRF)
frontend/         # React (Vite) minimal UI
ansible/          # Server deploy playbook
terraform/        # EC2 infra
docker-compose.yml
docker-compose.prod.yml
Dockerfile.backend
Dockerfile.frontend
Jenkinsfile
.pre-commit-config.yaml
pyproject.toml
```
