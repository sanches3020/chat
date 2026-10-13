FROM node:20-alpine

WORKDIR /bot

COPY package.json ./
RUN npm install --omit=dev --no-audit --no-fund

COPY *.js ./

ENV NODE_ENV=production
EXPOSE 8081

CMD ["node", "bot.js"]
