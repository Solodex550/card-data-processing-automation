#!/bin/sh
set -eu
cd /app
node --experimental-strip-types src/cli.ts \
  --input examples/source.csv \
  --output output/processed.csv \
  --audit output/audit.json
