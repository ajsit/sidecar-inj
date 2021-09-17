FROM node:14-alpine

WORKDIR /home/node

COPY . .

RUN npm install

USER node

CMD node webhook.js