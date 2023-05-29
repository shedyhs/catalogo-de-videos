import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src'],
  format: 'cjs',
  keepNames: true,
  silent: true,
  clean: true,
  treeshake: 'safest',
  dts: true,
});
