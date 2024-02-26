FROM node:16-alpine

WORKDIR /app

COPY . .

RUN npm i --only=prod
RUN npm i @nestjs/cli
RUN npm run build

RUN npm uninstall @nestjs/cli
RUN rm -rf src

EXPOSE 3000

CMD [ "npm" ,"run", "start:prod"]