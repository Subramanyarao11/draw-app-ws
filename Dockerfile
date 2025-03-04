FROM node:20-alpine as builder

WORKDIR /app

COPY package*.json ./
COPY turbo.json ./
COPY apps/api/package*.json ./apps/api/
COPY apps/client/package*.json ./apps/client/

RUN npm install --legacy-peer-deps

COPY . .

RUN npm run build

FROM node:20-alpine as production

WORKDIR /app

COPY package*.json ./
COPY apps/api/package*.json ./apps/api/

RUN npm install --only=production --legacy-peer-deps
RUN npm install --prefix apps/api --only=production --legacy-peer-deps

COPY --from=builder /app/apps/api/dist ./apps/api/dist
COPY --from=builder /app/apps/client/dist ./apps/client/dist

EXPOSE 3000

CMD ["npm", "start"]
