FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run db:generate && npm run build

EXPOSE 4000

CMD [ "npm", "run", "start" ]