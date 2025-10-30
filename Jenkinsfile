pipeline {
  agent any

  parameters {
    string(name: 'IMAGE_REPO', defaultValue: 'your default image base url', description: 'Base image repo')
    string(name: 'VERSION', defaultValue: 'latest', description: 'Image tag (default latest)')
  }

  environment {
    BACKEND_IMG = "${params.IMAGE_REPO}/backend:${params.VERSION}"
    FRONTEND_IMG = "${params.IMAGE_REPO}/frontend:${params.VERSION}"
    REGISTRY = "ghcr.io"
  }

  stages {
    stage('Checkout') { steps { checkout scm } }

    stage('Docker Login') {
      steps {
        withCredentials([usernamePassword(credentialsId: 'REGISTRY_CREDS', usernameVariable: 'REG_USER', passwordVariable: 'REG_PASS')]) {
          sh '''
            if [ -n "$REGISTRY" ]; then
              echo "$REG_PASS" | docker login "$REGISTRY" -u "$REG_USER" --password-stdin
            fi
          '''
        }
      }
    }

    stage('Build backend') {
      steps { sh 'docker build -f Dockerfile.backend -t "$BACKEND_IMG" .' }
    }

    stage('Build frontend') {
      steps {
        script {
          def apiUrl = sh(script: "grep VITE_API_BASE .env | cut -d '=' -f2-", returnStdout: true).trim()
          sh """
            docker build \
              --build-arg VITE_API="${apiUrl}" \
              -f Dockerfile.frontend \
              -t "$FRONTEND_IMG" \
              .
          """
        }
      }
    }

    stage('Push images') {
      steps {
        sh 'docker push "$BACKEND_IMG"'
        sh 'docker push "$FRONTEND_IMG"'
      }
    }

    stage('Deploy') {
      steps {
        withCredentials([sshUserPrivateKey(credentialsId: 'EC2_SSH_KEY', keyFileVariable: 'SSH_KEY')]) {
          sh '''
            ansible-galaxy collection install community.docker
            ansible-playbook -i ansible/inventory.ini ansible/playbook.yml \
              -e IMAGE_REPO="${IMAGE_REPO}" \
              -e IMAGE_TAG="${VERSION}" \
              --private-key "$SSH_KEY"
          '''
        }
      }
    }
  }

  post { always { sh 'docker image prune -f || true' } }
}
