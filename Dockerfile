FROM node:22-alpine
WORKDIR /app
COPY package.json ./
COPY src ./src
COPY examples ./examples
RUN mkdir -p /app/output && chown -R node:node /app/output
USER node
CMD ["node", "--experimental-strip-types", "src/cli.ts", "--input", "examples/source.csv", "--output", "output/processed.csv", "--audit", "output/audit.json"]
