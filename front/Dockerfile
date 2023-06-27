FROM node:12.11.0-alpine as builder 
WORKDIR /usr/src/app
COPY package.json package-lock.json  ./
RUN npm install 
COPY . .
RUN npm run build

FROM nginx:stable-alpine3.17-slim
COPY --from=builder /usr/src/app/dist/Inmunobio /usr/share/nginx/html


