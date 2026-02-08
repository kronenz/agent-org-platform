import * as esbuild from 'esbuild';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

await esbuild.build({
  entryPoints: ['./src/extension.ts'],
  bundle: true,
  outfile: 'out/extension.js',
  external: ['vscode'],
  platform: 'node',
  target: 'node18',
  format: 'cjs',
  sourcemap: true,
  alias: {
    '@agent-org/core': resolve(__dirname, '../core/src/index.ts'),
    '@agent-org/github': resolve(__dirname, '../github/src/index.ts'),
  },
});

console.log('Extension built successfully');
