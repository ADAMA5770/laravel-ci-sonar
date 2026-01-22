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
