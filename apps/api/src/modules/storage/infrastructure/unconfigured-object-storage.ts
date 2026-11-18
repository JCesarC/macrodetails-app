import { ObjectStorage, StorageNotConfiguredError } from '../domain/object-storage.js';

/**
 * Used when MEDIA_BUCKET is not set, so the API still boots without AWS
 * (local dev, CI). Any attempt to actually store a file fails loudly.
 */
export class UnconfiguredObjectStorage extends ObjectStorage {
  putObject(): Promise<never> {
    return Promise.reject(new StorageNotConfiguredError());
  }

  createUploadUrl(): Promise<never> {
    return Promise.reject(new StorageNotConfiguredError());
  }

  publicUrlFor(): string {
    throw new StorageNotConfiguredError();
  }
}
