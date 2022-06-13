## Builder
FROM node:16-alpine as builder

# Copy files
RUN mkdir /build
WORKDIR /build
COPY . /build 

# Install build dependencies
RUN npm install

# Build the application
RUN npm run build

## Runner
FROM node:16-alpine as runner

# Install ffmpeg and yt-dlp
RUN apk add --no-cache ffmpeg yt-dlp

# Copy over files
RUN mkdir -p /app/frontend/build /app/backend/build
COPY --from=builder /build/frontend/build /app/frontend/build
COPY --from=builder /build/backend/build /app/backend/build

# Copy package jsons
COPY package*.json /app
COPY backend/package*.json /app/backend

# Install dependencies
WORKDIR /app
RUN cd /app/backend && npm install

EXPOSE 8080
ENV NODE_ENV=production

# done
ENTRYPOINT [ "node" ]
CMD [ "/app/backend/build/index.js" ]