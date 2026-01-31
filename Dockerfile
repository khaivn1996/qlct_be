FROM node:20-bookworm-slim

RUN apt-get update && apt-get install -y \
   openssl \
    ca-certificates \
 && rm -rf /var/lib/apt/lists/*

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@latest --activate

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm prisma generate

RUN pnpm build

EXPOSE 3000

CMD ["node", "dist/src/main.js"]