FROM node:20.18.1-alpine

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

COPY . .

EXPOSE 9000

CMD ["npm","run","dev"]
