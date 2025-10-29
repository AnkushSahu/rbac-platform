# RBAC Platform (Django + DRF + React + Docker + Terraform + Ansible + Jenkins)

A production-grade starter for a **Role/Policy/Team** RBAC system with clean architecture,
tests, containerization, infrastructure-as-code, and CI/CD.

## Features
- **Django 5 + Django REST Framework** backend with PostgreSQL
- Entities: **Team**, **Role**, **Policy**, **Membership** (User→Team with Role), **RolePolicy** (many-to-many)
- CRUD APIs with validation & sensible defaults
- Token auth via **django-rest-framework-simplejwt**
- **CORS**, **Pagination**, **Filtering**, **Search**
- Unit & API tests using **pytest** + **pytest-django**
- **React (Vite)** frontend (minimal but functional)
- **Docker** for dev & prod, **docker-compose** for local
- **Jenkinsfile** for build/test/lint+typecheck/dockerize/deploy
- **Terraform** (AWS) to provision an EC2 host
- **Ansible** to deploy containers to the EC2 host

> Clone, configure `.env`, then run with Docker or deploy with Terraform+Ansible.

---

## Quickstart (Local Dev)

```bash
cp .env.example .env
docker compose up -d --build
# Backend: http://localhost:8000
# Frontend: http://localhost:5173
# API docs (drf-spectacular): http://localhost:8000/api/schema/swagger-ui/
```

Create superuser (optional; compose handles initial migration):
```bash
docker compose exec backend python manage.py createsuperuser
```

Run tests:
```bash
docker compose exec backend pytest -q
```

---

## Production Build

### 1) Build & push images
Set your registry env vars in Jenkins or locally:
- `IMAGE_REPO` (e.g. ghcr.io/you/rbac)
- `IMAGE_TAG` (e.g. git SHA)

Then Jenkinsfile (or locally) builds and pushes two images:
- `${IMAGE_REPO}/backend:${IMAGE_TAG}`
- `${IMAGE_REPO}/frontend:${IMAGE_TAG}`

### 2) Provision EC2 with Terraform
In `terraform/`:
```bash
terraform init
terraform apply -auto-approve   -var="aws_region=ap-south-1"   -var="key_pair_name=your-key"   -var="project_name=rbac-platform"   -var="allow_cidr=0.0.0.0/0"
```
Note the `public_ip` output.

### 3) Deploy with Ansible
Update `ansible/inventory.ini` with the EC2 IP. Then:
```bash
ansible-galaxy collection install community.docker
ansible-playbook -i ansible/inventory.ini ansible/playbook.yml   -e image_repo="ghcr.io/you/rbac" -e image_tag="latest"
```

Ansible will:
- Install Docker/compose if needed
- Upload `.env` (from your local `.env`)
- Pull and run the `docker-compose.prod.yml` on the server

---

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
