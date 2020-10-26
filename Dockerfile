FROM node:14.13.1-alpine3.12

ARG port=8080

RUN mkdir -p /home/node/files

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

WORKDIR /home/node/app

COPY package*.json ./

RUN npm install

COPY --chown=node:node ./dist .

ENV PORT=${port}

EXPOSE ${port}

CMD npm run start