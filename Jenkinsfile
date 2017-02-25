pipeline {

  agent { label 'docker-build-slave' }

  environment {
    IMAGE = 'registry.gitlab.com/danday74/bible-server'
    DOCKER_REGISTRY_CREDENTIALS = credentials('GITLAB_CREDENTIALS')
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
        sh 'docker login -u ${DOCKER_REGISTRY_CREDENTIALS_USR} -p ${DOCKER_REGISTRY_CREDENTIALS_PSW} registry.gitlab.com'
        sh 'docker build -t ${IMAGE}:${BRANCH_NAME} .'
        sh 'docker push ${IMAGE}:${BRANCH_NAME}'
      }
    }

    stage('Deploy') {
      when {
        branch 'master'
      }
      steps {
        echo 'Deploy'
      }
    }
  }

  post {
    success {
      echo 'Success'
      // build '../downstream/master' // this works
    }
    failure {
      mail to: ${DEFAULT_MAILER_TO_ADDRESS}, subject: 'BUILD FAILURE: ${currentBuild.fullDisplayName}', body: 'Fix the build at ${BUILD_URL}'
    }
  }
}
