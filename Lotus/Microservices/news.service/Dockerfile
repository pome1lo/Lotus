FROM node:latest

WORKDIR /app

COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 31904

CMD [ "node", "app.js" ]
