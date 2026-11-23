FROM node:22-bookworm-slim
WORKDIR /app
COPY package.json ./
COPY src/ /app/src/
COPY examples/ /app/examples/
RUN mkdir -p /app/output
