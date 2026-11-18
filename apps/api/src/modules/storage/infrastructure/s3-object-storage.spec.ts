import { describe, expect, it } from 'vitest';
import { S3ObjectStorage } from './s3-object-storage.js';

const storage = new S3ObjectStorage({
  region: 'us-east-1',
  bucket: 'test-bucket',
  publicBaseUrl: 'https://cdn.example.com/',
});

describe('S3ObjectStorage', () => {
  it('builds CDN URLs without double slashes and encodes each segment', () => {
    expect(storage.publicUrlFor('products/ramo rojo/1.jpg')).toBe(
      'https://cdn.example.com/products/ramo%20rojo/1.jpg',
    );
  });

  it('signs upload URLs for the configured bucket and key', async () => {
    const { uploadUrl, publicUrl } = await withFakeCredentials(() =>
      storage.createUploadUrl({ key: 'uploads/a.png', contentType: 'image/png' }),
    );

    expect(uploadUrl).toContain('test-bucket');
    expect(uploadUrl).toContain('uploads/a.png');
    expect(uploadUrl).toContain('X-Amz-Signature=');
    expect(publicUrl).toBe('https://cdn.example.com/uploads/a.png');
  });
});

/** Presigning is a local computation; fake credentials keep the test offline. */
async function withFakeCredentials<T>(run: () => Promise<T>): Promise<T> {
  const saved = { ...process.env };
  process.env.AWS_ACCESS_KEY_ID = 'AKIAFAKEFAKEFAKEFAKE';
  process.env.AWS_SECRET_ACCESS_KEY = 'fake-secret';
  delete process.env.AWS_PROFILE;
  try {
    return await run();
  } finally {
    process.env = saved;
  }
}
