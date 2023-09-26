## Builder
FROM node:16-slim as frontend 

# install bun
# RUN apt-get update && apt-get install -y curl unzip
# RUN curl -fsSL https://bun.sh/install | bash 

# Copy files
RUN mkdir /build
WORKDIR /build
COPY . /build

# Install build dependencies
# RUN install

# Build frontend 
RUN cd frontend && npm install && npm run build 

## Runner
FROM oven/bun:latest as runner

# Install ffmpeg, python3
RUN apt-get update && apt-get install -y ffmpeg python3

# Copy over files
RUN mkdir -p /app/frontend/build
COPY --from=frontend /build/frontend/build /app/frontend/build
COPY /backend /app/backend

# Install backend dependencies
RUN cd /app/backend && bun install

# Expose port
EXPOSE 8080

# Run backend
WORKDIR /app
CMD ["bun", "run", "/app/backend/src/index.ts"]
