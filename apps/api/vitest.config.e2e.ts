import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: { tsconfigPaths: true },
  test: {
    globals: true,
    root: './',
    include: ['**/*.e2e-spec.ts'],
    setupFiles: ['./test/support/setup-e2e.ts'],
    // e2e suites share one database, so they must not run in parallel.
    fileParallelism: false,
    hookTimeout: 30_000,
  },
});
