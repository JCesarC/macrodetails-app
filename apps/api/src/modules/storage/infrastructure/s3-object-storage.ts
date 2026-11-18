import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import {
  ObjectStorage,
  type PutObjectInput,
  type UploadUrl,
  type UploadUrlInput,
} from '../domain/object-storage.js';

const ONE_YEAR_IMMUTABLE = 'public, max-age=31536000, immutable';
const DEFAULT_UPLOAD_URL_TTL_SECONDS = 300;

export interface S3ObjectStorageConfig {
  region: string;
  bucket: string;
  /** CDN origin that serves the bucket, e.g. https://d123.cloudfront.net */
  publicBaseUrl: string;
}

/**
 * S3 adapter. Credentials come from the default AWS provider chain:
 * AWS_PROFILE (SSO) locally, the task role in AWS. No static keys.
 */
export class S3ObjectStorage extends ObjectStorage {
  private readonly client: S3Client;

  constructor(private readonly config: S3ObjectStorageConfig) {
    super();
    this.client = new S3Client({ region: config.region });
  }

  async putObject({ key, body, contentType, cacheControl }: PutObjectInput) {
    await this.client.send(
      new PutObjectCommand({
        Bucket: this.config.bucket,
        Key: key,
        Body: body,
        ContentType: contentType,
        CacheControl: cacheControl ?? ONE_YEAR_IMMUTABLE,
      }),
    );
    return { publicUrl: this.publicUrlFor(key) };
  }

  async createUploadUrl({
    key,
    contentType,
    expiresInSeconds,
  }: UploadUrlInput): Promise<UploadUrl> {
    const command = new PutObjectCommand({
      Bucket: this.config.bucket,
      Key: key,
      ContentType: contentType,
      CacheControl: ONE_YEAR_IMMUTABLE,
    });
    const uploadUrl = await getSignedUrl(this.client, command, {
      expiresIn: expiresInSeconds ?? DEFAULT_UPLOAD_URL_TTL_SECONDS,
    });
    return { uploadUrl, publicUrl: this.publicUrlFor(key) };
  }

  publicUrlFor(key: string): string {
    const base = this.config.publicBaseUrl.replace(/\/+$/, '');
    return `${base}/${key.split('/').map(encodeURIComponent).join('/')}`;
  }
}
