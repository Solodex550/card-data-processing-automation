import { readFile, writeFile, mkdir, rename, unlink } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { randomUUID } from 'node:crypto';
import { processFeed } from './pipeline.ts';

function parseArgs(argv: string[]): { input: string; output: string; audit: string } {
  const args = new Map<string, string>();
  for (let i = 0; i < argv.length; i += 2) {
    if (!argv[i]?.startsWith('--') || !argv[i+1]) throw new Error('Usage: --input FILE --output FILE --audit FILE');
    args.set(argv[i].slice(2), argv[i+1]);
  }
  for (const arg of ['input', 'output', 'audit']) if (!args.has(arg)) throw new Error(`Missing --${arg}`);
  return { input: resolve(args.get('input')!), output: resolve(args.get('output')!), audit: resolve(args.get('audit')!) };
}

async function writeAtomic(destination: string, data: string): Promise<void> {
  await mkdir(dirname(destination), { recursive: true });
  const temp = `${destination}.${randomUUID()}.tmp`;
  try {
    await writeFile(temp, data, { mode: 0o600 });
    await rename(temp, destination);
  } finally {
    await unlink(temp).catch(() => {});
  }
}

try {
  const { input, output, audit } = parseArgs(process.argv.slice(2));
  if (new Set([input, output, audit]).size !== 3) throw new Error('Input, output and audit paths must differ');
  const result = processFeed(await readFile(input, 'utf8'));
  await writeAtomic(output, result.output);
  await writeAtomic(audit, JSON.stringify(result.audit, null, 2) + '\n');
  console.log(`Processed ${result.audit.processed} synthetic records; output: ${output}`);
} catch (error) {
  console.error(`ERROR: ${error instanceof Error ? error.message : String(error)}`);
  process.exitCode = 1;
}
