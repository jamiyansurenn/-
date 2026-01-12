# Backend Dockerfile (Render дээр ашиглахгүй, гэхдээ бэлэн байлгасан)

FROM node:18-alpine

WORKDIR /app

# Dependencies
COPY package*.json ./
RUN npm ci --only=production

# Prisma
COPY prisma ./prisma
RUN npx prisma generate

# Build
COPY . .
RUN npm run build

# Start
CMD ["npm", "run", "start:prod"]
