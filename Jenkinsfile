pipeline {
    agent any

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install dependencies') {
            steps {
                dir('backend') {
                    bat 'composer install'
                }
            }
        }

        stage('Prepare Laravel') {
            steps {
                dir('backend') {
                    // Créer le fichier .env pour Jenkins
                    bat 'copy .env.example .env'

                    // Générer la clé Laravel (APP_KEY)
                    bat 'php artisan key:generate'
                }
            }
        }

        stage('Tests') {
            steps {
                dir('backend') {
                    bat 'php artisan test'
                }
            }
        }

        stage('SonarQube Analysis') {
            steps {
                withSonarQubeEnv('SonarQube') {
                    dir('backend') {
                        bat """
                        sonar-scanner ^
                          -Dsonar.projectKey=laravel-ci-sonar ^
                          -Dsonar.sources=. ^
                          -Dsonar.host.url=http://localhost:9000 ^
                          -Dsonar.login=%SONAR_TOKEN%
                        """
                    }
                }
            }
        }
    }
}
