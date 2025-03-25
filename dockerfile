# syntax=docker/dockerfile:1

FROM node:22.13.1-alpine as base

WORKDIR /app

COPY .npmrc .npmrc  
COPY package*.json ./
RUN npm install
COPY . .
RUN rm -f .npmrc

RUN npm run build

FROM base as final

ENV NODE_ENV=production

EXPOSE 3000

CMD ["npm", "run", "start"]
