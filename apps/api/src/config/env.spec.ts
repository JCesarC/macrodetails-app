import { describe, expect, it } from 'vitest';
import { validateEnv } from './env.js';

const base = { MONGODB_URI: 'mongodb://localhost:27017/test' };

describe('validateEnv', () => {
  it('applies defaults', () => {
    expect(validateEnv(base)).toMatchObject({
      NODE_ENV: 'development',
      PORT: 4000,
      AWS_REGION: 'us-east-2',
    });
  });

  it('treats empty media variables as unset', () => {
    const env = validateEnv({ ...base, MEDIA_BUCKET: '', MEDIA_BASE_URL: '' });

    expect(env.MEDIA_BUCKET).toBeUndefined();
    expect(env.MEDIA_BASE_URL).toBeUndefined();
  });

  it('names the missing variable in the error', () => {
    expect(() => validateEnv({})).toThrow(/MONGODB_URI/);
  });
});
