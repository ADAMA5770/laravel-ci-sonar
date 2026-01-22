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
                    bat 'copy .env.example .env'
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
                    withCredentials([string(credentialsId: 'sonar-token', variable: 'SONAR_TOKEN')]) {
                        dir('backend') {
                            bat """
                            sonar-scanner ^
                              -Dsonar.projectKey=laravel-ci-sonar ^
                              -Dsonar.sources=. ^
                              -Dsonar.login=%SONAR_TOKEN%
                            """
                        }
                    }
                }
            }
        }
    }
}
