pipeline {
  agent any

  environment {
    ANGULAR_CLI_VERSION = '19.1.6'
    STAGING_PATH = "/opt/frontend-staging"
    APP_NAME = "MarkDoc"
    DEPLOY_PATH = "/var/www/html"
  }

  stages {
    stage('Install Dependencies') {
      steps {
        script {
          sh 'npm ci'
        }
      }
    }

    stage('Build Angular App') {
      steps {
        script {
          sh 'npm run build --prod'
        }
      }
    }

    stage('Move Build to Staging Folder') {
      steps {
        script {
          sh "rm -rf ${STAGING_PATH}/*"
          sh "cp -r dist/${APP_NAME}/* ${STAGING_PATH}/"
        }
      }
    }

    stage('Deploy to Server') {
      steps {
        script {
          sh "rm -rf ${DEPLOY_PATH}/*"
          sh "cp -r ${STAGING_PATH}/* ${DEPLOY_PATH}/"
        }
      }
    }

    stage('Restart Web Server') {
      steps {
        script {
          sh "sudo systemctl reload nginx"
        }
      }
    }
  }

  post {
    always {
      echo 'Pipeline execution finished.'
    }

    success {
      echo '✅ Frontend deployment was successful.'
    }

    failure {
      echo '❌ Frontend deployment failed.'
    }
  }
}
