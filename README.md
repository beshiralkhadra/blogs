# Blog Monorepo

A Turborepo-based blog application with API backend and Next.js frontend.

## Architecture

- **API** (`apps/api`): Node.js/Express backend with PostgreSQL database
- **Web** (`apps/web`): Next.js frontend with React 19 and TypeScript

## Development

### Prerequisites
- Node.js 18+
- pnpm 10.15.1+

### Local Development
```bash
# Install dependencies
pnpm install

# Run in development mode
pnpm dev
```

## Docker

### Quick Start with Docker Compose

For local development:
```bash
# Run individual services
docker-compose up api web

# Or run the full monorepo (alternative approach)
docker-compose --profile full-dev up dev
```

### Individual Services

#### API Service
```bash
# Development
cd apps/api
docker build -t blog-api:dev --target development .
docker run -p 3000:3000 blog-api:dev

# Production
docker build -t blog-api:prod --target production .
docker run -p 3000:3000 blog-api:prod
```

#### Web Service
```bash
# Development
cd apps/web
docker build -t blog-web:dev --target development .
docker run -p 3001:3001 blog-web:dev

# Production
docker build -t blog-web:prod --target production .
docker run -p 3001:3001 blog-web:prod
```

### Full Monorepo Build

Build both applications from root:
```bash
# Build API
docker build -t blog-api --target api .

# Build Web
docker build -t blog-web --target web .

# Development
docker build -t blog-mono:dev --target development .
docker run -p 3000:3000 -p 3001:3001 blog-mono:dev
```

## Scripts

- `pnpm dev` - Start development servers
- `pnpm build` - Build all applications
- `pnpm test` - Run all tests
- `pnpm lint` - Lint all code

## Deployment

The Docker setup supports multiple deployment strategies:
1. **Monorepo**: Single container with both services
2. **Microservices**: Separate containers for API and web
3. **Development**: Hot-reload enabled containers
