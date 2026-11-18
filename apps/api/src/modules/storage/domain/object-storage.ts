export interface PutObjectInput {
  key: string;
  body: Uint8Array;
  contentType: string;
  /** Cache-Control header served by the CDN. Defaults to one year, immutable. */
  cacheControl?: string;
}

export interface UploadUrlInput {
  key: string;
  contentType: string;
  expiresInSeconds?: number;
}

export interface UploadUrl {
  /** Pre-signed URL the browser uses to PUT the file directly to storage. */
  uploadUrl: string;
  /** Where the file will be publicly served once uploaded. */
  publicUrl: string;
}

/** Port: binary object storage (S3 in production). */
export abstract class ObjectStorage {
  abstract putObject(input: PutObjectInput): Promise<{ publicUrl: string }>;
  abstract createUploadUrl(input: UploadUrlInput): Promise<UploadUrl>;
  abstract publicUrlFor(key: string): string;
}

export class StorageNotConfiguredError extends Error {
  constructor() {
    super('Object storage is not configured: set MEDIA_BUCKET and MEDIA_BASE_URL');
    this.name = 'StorageNotConfiguredError';
  }
}
