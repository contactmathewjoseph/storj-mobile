pipeline {
  agent any
  stages {
    stage('Install Deps') {
      steps {
        sh 'npm install'
      }
    }
    stage('Test') {
      steps {
        sh 'npm test'
      }
    }
    stage('Build Debug APK') {
      steps {
        sh '''cd android
./gradlew assembleDebug'''
      }
    }
  }
  post {
    always {
      junit 'junit.xml'
      archiveArtifacts artifacts: 'android/app/build/outputs/apk/*.apk', allowEmptyArchive: true
    }
  } 
}
