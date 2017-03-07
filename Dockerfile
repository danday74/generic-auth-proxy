# export IMAGE=registry.gitlab.com/danday74/auth-server
# docker build -t ${IMAGE} .
# docker run -d --name auth -p "51108:51108" -p "51109:51109" -v /etc/ssl/letsencrypt:/etc/ssl/letsencrypt ${IMAGE}
# docker push ${IMAGE}

FROM node:6.10.0
# http
EXPOSE 51108
# https
EXPOSE 51109

ENV wd /usr/src/app
ENV wds /usr/src/app/

# RUN npm i -g yarn # yarn is now pre-installed
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
