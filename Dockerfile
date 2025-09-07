FROM node:23-alpine3.21 AS builder

WORKDIR /app

COPY package.json .
COPY package-lock.json .

RUN npm install

COPY . .

ENV NODE_ENV=production
RUN npm run build

FROM nginx:latest

COPY --from=builder /app/dist /usr/share/nginx/html