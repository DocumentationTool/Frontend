pipeline {
  agent any

    environment {
    ANGULAR_CLI_VERSION = '19.1.6'
        STAGING_PATH = "/opt/frontend-staging"
        APP_NAME = "document-web"
        DEPLOY_USER = "user"
        DEPLOY_HOST = "your-server"
        DEPLOY_PATH = "/var/www/html"
    }

    stages {
    stage('Install Node & Angular CLI') {
      steps {
        script {
          sh 'curl -sL https://deb.nodesource.com/setup_16.x | bash -'
            sh 'apt-get install -y nodejs'
            sh 'npm install -g @angular/cli@${ANGULAR_CLI_VERSION}'
        }
      }
    }


     stage('Install Dependencies') {
      steps {
        script {
          sh 'npm install'
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
          // You can adjust this depending on the setup:
                    sh "scp -r ${STAGING_PATH}/* ${DEPLOY_USER}@${DEPLOY_HOST}:${DEPLOY_PATH}/"
                }
            }
        }

        // Optional: Restart frontend server if needed (e.g., nginx reload)
        stage('Restart Web Server') {
      steps {
        script {
          sh """
                        ssh ${DEPLOY_USER}@${DEPLOY_HOST} 'sudo systemctl reload nginx'
                    """
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
