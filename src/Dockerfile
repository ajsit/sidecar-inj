FROM node:14

WORKDIR /home/node

COPY . .

RUN npm install
# Chown Certs for node
RUN chown node:node webhook.key
RUN chown node:node webhook.csr

USER node

CMD node sidecar.js