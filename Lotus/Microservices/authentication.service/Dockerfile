FROM node:latest

WORKDIR /app

COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 31002

CMD [ "node", "app.js" ]
