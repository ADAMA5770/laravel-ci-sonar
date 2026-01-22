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
