pipeline {

  agent { label 'docker-build-slave' }

  environment {
    IMAGE = 'registry.gitlab.com/danday74/bible-server'
    // DOCKER_REGISTRY_CREDENTIALS = credentials('DOCKER_REGISTRY_CREDENTIALS')
  }

  options {
    timeout(10)
    timestamps()
  }

  stages {

    stage('Test') {
      steps {
        sh 'yarn'
        sh 'npm test'
      }
    }

    stage('Build') {
      when {
        branch 'master'
      }
      steps {
        // sh 'docker login -u ${DOCKER_REGISTRY_CREDENTIALS_USR} -p ${DOCKER_REGISTRY_CREDENTIALS_PSW} registry.gitlab.com'
        sh 'docker build -t ${IMAGE}:${BRANCH_NAME} .'
        sh 'docker push ${IMAGE}:${BRANCH_NAME}'
      }
    }

    stage('Deploy') {
      when {
        branch 'master'
      }
      steps {
        echo 'Deploying'
      }
    }
  }

  post {
    success {
      echo 'Success'
    }
    failure {
      // mail to: "daniellewis777@gmail.com", subject:"FAILURE: ${currentBuild.fullDisplayName}", body: "Boo, we failed."
      echo 'Failure'
    }
  }
}
