pipeline {
  agent any
  environment {
    IMAGE_REPO = credentials('RBAC_IMAGE_REPO') // e.g., ghcr.io/you/rbac
    IMAGE_TAG = "${env.GIT_COMMIT}"
  }
  options { timestamps() }
  stages {
    stage('Checkout') { steps { checkout scm } }
    stage('Python Setup & Test') {
      agent { docker { image 'python:3.11-slim' } }
      steps {
        sh '''
          pip install --no-cache-dir -r backend/requirements.txt
          pip install --no-cache-dir pytest pytest-django black isort flake8
          black --check backend || true
          isort --check-only backend || true
          flake8 backend || true
          cd backend && pytest -q
        '''
      }
    }
    stage('Frontend Build') {
      agent { docker { image 'node:20-alpine' } }
      steps {
        sh '''
          cd frontend
          npm ci
          npm run build
        '''
      }
    }
    stage('Build & Push Images') {
      steps {
        sh '''
          docker build -f Dockerfile.backend -t ${IMAGE_REPO}/backend:${IMAGE_TAG} .
          docker build -f Dockerfile.frontend -t ${IMAGE_REPO}/frontend:${IMAGE_TAG} .
          echo "$CR_PAT" | docker login ghcr.io -u USERNAME --password-stdin || true
          docker push ${IMAGE_REPO}/backend:${IMAGE_TAG}
          docker push ${IMAGE_REPO}/frontend:${IMAGE_TAG}
        '''
      }
    }
    stage('Deploy (Ansible)') {
      when { expression { return params.DEPLOY == null || params.DEPLOY == true } }
      steps {
        sh '''
          ansible-galaxy collection install community.docker
          ansible-playbook -i ansible/inventory.ini ansible/playbook.yml \
            -e image_repo="${IMAGE_REPO}" -e image_tag="${IMAGE_TAG}"
        '''
      }
    }
  }
  post {
    always { archiveArtifacts artifacts: 'frontend/dist/**,backend/**/reports/**', allowEmptyArchive: true }
  }
}
