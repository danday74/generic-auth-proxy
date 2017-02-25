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

    stage('EnvTest') {
      steps {
        echo '${DEFAULT_MAILER_TO_ADDRESS}'
        echo "${DEFAULT_MAILER_TO_ADDRESS}"
        echo '${env.DEFAULT_MAILER_TO_ADDRESS}'
        echo "${env.DEFAULT_MAILER_TO_ADDRESS}"
        echo '${currentBuild.fullDisplayName}'
        echo "${currentBuild.fullDisplayName}"
        echo '${BUILD_URL}'
        echo "${BUILD_URL}"
//        echo '${PROJECT_URL}'
        echo '${JENKINS_URL}'
        echo "${JENKINS_URL}"
        echo "${PROJECT_URL}"
      }
    }

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
      mail to: ${DEFAULT_MAILER_TO_ADDRESS}, subject: 'BUILD SUCCESS: ${currentBuild.fullDisplayName}', body: 'Fix the build at ${BUILD_URL}'
      // build '../downstream/master' // this works
    }
    failure {
      mail to: ${DEFAULT_MAILER_TO_ADDRESS}, subject: 'BUILD FAILURE: ${currentBuild.fullDisplayName}', body: 'Fix the build at ${BUILD_URL}'
    }
  }
}
