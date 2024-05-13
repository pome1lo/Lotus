FROM node:latest

WORKDIR /app

COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 31903

CMD [ "node", "app.js" ]
