import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.{test,spec}.ts', 'tests/**/*.{test,spec}.ts'],
    // Integration tests need Docker and have their own config: vitest.integration.config.ts.
    exclude: ['tests/integration/**', '**/node_modules/**'],
    clearMocks: true,
    // Modules that import src/env.ts validate the environment on import (ADR ARCH-001). Tests must
    // not depend on a local .env: DOTENV_CONFIG_PATH points dotenv at a file that does not exist,
    // so it loads nothing, and the tests get a test database URL instead; they can still stub it.
    env: {
      DATABASE_URL: 'postgres://test:test@localhost:5432/test',
      DOTENV_CONFIG_PATH: '.env.tests-load-no-file',
      DOTENV_CONFIG_QUIET: 'true',
    },
    coverage: {
      provider: 'v8',
      include: ['src/**/*.ts'],
      // src/db needs a real database: tests/integration covers it (Testcontainers), not unit tests.
      exclude: ['src/**/*.{test,spec}.ts', 'src/index.ts', 'src/db/**'],
      reporter: ['text', 'html', 'lcov', 'json'],
      thresholds: {
        branches: 90,
        functions: 90,
        lines: 90,
        statements: 90,
      },
    },
  },
});
