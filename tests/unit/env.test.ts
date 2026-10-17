import { afterEach, describe, expect, it, vi } from 'vitest';

import type { env } from '../../src/env.ts';

const validUrl = 'postgres://user:password@localhost:5432/database';

async function loadEnvironment(): Promise<{ env: typeof env }> {
  vi.resetModules();

  return import('../../src/env.ts');
}

describe('env', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it.each(['development', 'test', 'production'])('accepts NODE_ENV %s', async nodeEnvironment => {
    expect.assertions(1);
    vi.stubEnv('NODE_ENV', nodeEnvironment);
    vi.stubEnv('LOG_LEVEL', undefined);
    vi.stubEnv('DATABASE_URL', validUrl);

    const { env } = await loadEnvironment();

    expect(env).toStrictEqual({
      DATABASE_URL: validUrl,
      LOG_LEVEL: 'info',
      NODE_ENV: nodeEnvironment,
    });
  });

  it.each(['fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent'])(
    'accepts LOG_LEVEL %s',
    async logLevel => {
      expect.assertions(1);
      vi.stubEnv('LOG_LEVEL', logLevel);
      vi.stubEnv('DATABASE_URL', validUrl);

      const { env } = await loadEnvironment();

      expect(env.LOG_LEVEL).toBe(logLevel);
    },
  );

  it('defaults LOG_LEVEL to info', async () => {
    expect.assertions(1);
    vi.stubEnv('LOG_LEVEL', undefined);
    vi.stubEnv('DATABASE_URL', validUrl);

    const { env } = await loadEnvironment();

    expect(env.LOG_LEVEL).toBe('info');
  });

  it('defaults NODE_ENV to development', async () => {
    expect.assertions(1);
    vi.stubEnv('NODE_ENV', undefined);
    vi.stubEnv('DATABASE_URL', validUrl);

    const { env } = await loadEnvironment();

    expect(env.NODE_ENV).toBe('development');
  });

  it('lists every invalid key in the error', async () => {
    expect.assertions(1);
    vi.stubEnv('NODE_ENV', 'staging');
    vi.stubEnv('DATABASE_URL', 'not a url');

    await expect(loadEnvironment()).rejects.toThrow(
      'Missing or invalid values in .env:\nNODE_ENV\nDATABASE_URL',
    );
  });
});
