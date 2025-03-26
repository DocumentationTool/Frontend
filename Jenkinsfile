pipeline {
	agent any

    environment {
		NODE_HOME = '/usr/local/bin/node'
        ANGULAR_CLI_VERSION = '19.1.6'
    }

    stages {
		stage('Pull Latest Changes') {
			steps {
				git 'https://github.com/DocumentationTool/Frontend'
            }
        }

        stage('Install Dependencies') {
			steps {
				script {
					sh 'curl -sL https://deb.nodesource.com/setup_16.x | sudo -E bash -'
                    sh 'sudo apt-get install -y nodejs'

                    sh 'npm install -g @angular/cli@${ANGULAR_CLI_VERSION}'

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

        // Schritt 4: Deployment der Build-Dateien (z.B. auf einem Webserver oder S3)
        stage('Deploy') {
			steps {
				script {
					// Beispiel: Deployment auf einem Webserver (z.B. FTP, SFTP, oder anderen)
                    // Du kannst diesen Abschnitt anpassen, je nachdem, wie dein Deployment-Ziel aussieht
                    sh 'scp -r dist/document-web/* user@your-server:/path/to/deploy'

                    // Falls du auf AWS S3 deployen möchtest, könntest du diesen Befehl verwenden:
                    // sh 'aws s3 sync dist/document-web s3://your-bucket-name/'

                    // Alternativ kannst du hier z.B. einen Docker-Container oder ein Kubernetes-Deployment verwenden
                }
            }
        }
    }

post {
		always {
			echo 'Pipeline execution finished.'
        }

        success {
			echo '✅ Deployment was successful.'
        }

        failure {
			echo '❌ Deployment failed.'
        }
    }
}
