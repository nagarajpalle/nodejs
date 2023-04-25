FROM node:14-alphine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

ENV NODE_ENV prouction

EXPOSE 3000

CMD ["npm","start"]


