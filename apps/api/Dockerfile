FROM node:20-alpine AS base
RUN apk add --no-cache libc6-compat
RUN corepack enable

FROM base AS builder
WORKDIR /app
# Add build tools needed for native modules
RUN apk add --no-cache python3 make g++

RUN npm install -g turbo@1.13.4
RUN corepack prepare pnpm@10.15.1 --activate

COPY . .

RUN turbo prune --scope=api --docker


FROM base as installer
WORKDIR /app
# Add build tools needed for native modules
RUN apk add --no-cache python3 make g++

RUN npm install -g turbo@1.13.4
RUN corepack prepare pnpm@10.15.1 --activate

COPY .gitignore .gitignore
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
RUN pnpm install

COPY --from=builder /app/out/full/ .
COPY turbo.json turbo.json


RUN turbo run build --filter=api...

FROM base AS runner
WORKDIR /app
# Add build tools needed for native modules at runtime
RUN apk add --no-cache python3 make g++

RUN corepack prepare pnpm@10.15.1 --activate

RUN addgroup --system --gid 1001 expressjs
RUN adduser --system --uid 1001 expressjs

COPY --from=installer /app .

USER expressjs

CMD pnpm --filter api run start
