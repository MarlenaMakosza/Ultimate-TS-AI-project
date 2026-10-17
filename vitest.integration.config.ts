import { defineConfig } from 'vitest/config';

// Integration tests run against real services in containers (Testcontainers), so they need
// Docker and are slower than unit tests. They run with `npm run test:integration`, never as part
// of `npm test`, coverage or mutation testing.
export default defineConfig({
  test: {
    environment: 'node',
    include: ['tests/integration/**/*.{test,spec}.ts'],
    clearMocks: true,
    // Same reason as in vitest.config.ts: importing src/env.ts validates the environment.
    env: {
      DATABASE_URL: 'postgres://test:test@localhost:5432/test',
      DOTENV_CONFIG_PATH: '.env.tests-load-no-file',
      DOTENV_CONFIG_QUIET: 'true',
    },
    // Pulling the image and starting the container takes longer than a unit test may.
    hookTimeout: 120_000,
    testTimeout: 30_000,
  },
});
