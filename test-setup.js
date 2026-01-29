import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const projectRoot = process.cwd();

async function assertPathExists(relativePath) {
  const fullPath = path.join(projectRoot, relativePath);
  try {
    await fs.access(fullPath);
  } catch {
    throw new Error(`Missing required path: ${relativePath}`);
  }
}

async function main() {
  await assertPathExists('package.json');
  await assertPathExists('client');
  await assertPathExists('server');
  await assertPathExists('shared');
  await assertPathExists('script');

  // Keep this intentionally lightweight: it is used as a smoke check in CI.
  process.stdout.write('test-setup: ok\n');
}

main().catch((error) => {
  console.error('test-setup: failed');
  console.error(error);
  process.exitCode = 1;
});

