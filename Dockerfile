# export IMAGE=registry.gitlab.com/danday74/auth-server
# docker build -t ${IMAGE} .
# docker run ???
# docker push ${IMAGE}

FROM node:6.10.0
EXPOSE 51108 # http
EXPOSE 51109 # https

ENV wd /usr/src/app
ENV wds /usr/src/app/

RUN npm i -g yarn
RUN yarn global add pm2

RUN mkdir -p ${wd}
WORKDIR ${wd}

COPY js ${wd}/js
COPY middlewares ${wd}/middlewares
COPY routes ${wd}/routes
COPY test ${wd}/test

COPY authServer.config.js ${wds}
COPY authServer.js ${wds}
COPY package.json ${wds}
COPY pm2.yaml ${wds}
COPY yarn.lock ${wds}

RUN yarn install --prod

CMD ["pm2-docker", "pm2.yaml"]
