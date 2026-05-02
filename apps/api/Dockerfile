# Build from monorepo root context
FROM node:20-alpine AS builder
WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy workspace config and root package files
COPY package.json pnpm-workspace.yaml turbo.json ./
COPY packages/shared ./packages/shared
COPY apps/api ./apps/api

# Install all workspace deps and build
RUN pnpm install --no-frozen-lockfile
RUN pnpm --filter @expressions/shared build
RUN pnpm --filter @expressions/api build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=8080

# Copy only production deps and built output
COPY --from=builder /app/apps/api/package.json ./
COPY --from=builder /app/apps/api/dist ./dist
COPY --from=builder /app/packages/shared/dist ./node_modules/@expressions/shared/dist
COPY --from=builder /app/packages/shared/package.json ./node_modules/@expressions/shared/package.json

# Remove workspace:^ dep before npm install (it's already placed in node_modules above)
RUN npm pkg delete dependencies.@expressions/shared && \
    npm install --omit=dev --ignore-scripts && \
    npm cache clean --force

EXPOSE 8080
CMD ["node", "dist/index.js"]
