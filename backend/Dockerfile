# Backend: Express + Drizzle (TypeScript via tsx)
FROM node:20-alpine

WORKDIR /app

# install dependencies first (better layer caching)
COPY package*.json ./
RUN npm ci

# copy source
COPY . .

EXPOSE 4000

# run migrations, then start the server (env comes from compose)
CMD ["sh", "-c", "npx drizzle-kit migrate && npm run dev:docker"]
