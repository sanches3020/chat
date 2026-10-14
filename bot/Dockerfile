FROM node:20-alpine

WORKDIR /bot

COPY package.json ./
RUN npm install

COPY . .

ENV NODE_ENV=production
EXPOSE 8081

CMD ["node", "server.js"]
