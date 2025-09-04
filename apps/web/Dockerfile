FROM node:20-alpine AS base

RUN apk add --no-cache libc6-compat
RUN corepack enable

FROM base AS builder
RUN apk add --no-cache libc6-compat
RUN apk update

WORKDIR /app
RUN npm install -g turbo@1.13.4
RUN corepack prepare pnpm@10.15.1 --activate
COPY . .
RUN turbo prune --scope=web --docker

FROM base AS installer
WORKDIR /app
RUN npm install -g turbo@1.13.4
RUN corepack prepare pnpm@10.15.1 --activate
COPY .gitignore .gitignore
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
RUN pnpm install

COPY --from=builder /app/out/full/ .
COPY turbo.json turbo.json
RUN turbo run build --filter=web...



FROM base AS runner
WORKDIR /app
RUN corepack prepare pnpm@10.15.1 --activate
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs
COPY --from=installer /app .

CMD pnpm --filter web run start
