FROM node:18-slim

RUN apt-get update && apt-get install -y openssl libssl3 && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
COPY prisma ./prisma/
RUN npx prisma generate

EXPOSE 3000

CMD ["npm", "run", "start:dev"]