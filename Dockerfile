# Build stage: compila NestJS y deja solo dependencias de produccion.
FROM node:22-bookworm-slim AS build

RUN apt-get update \
    && apt-get install -y --no-install-recommends python3 make g++ \
    && rm -rf /var/lib/apt/lists/*

RUN npm install -g pnpm@11.1.1

WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm build && pnpm prune --prod

# Runtime stage.
FROM node:22-bookworm-slim AS runtime

ENV NODE_ENV=production

WORKDIR /app

COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/src/templates ./src/templates
COPY --from=build /app/resources ./resources
COPY --from=build /app/package.json ./package.json

# uploads se monta como directorio persistente en CapRover (/app/uploads).
RUN mkdir -p uploads/xlsx

EXPOSE 3000

CMD ["node", "dist/main.js"]
