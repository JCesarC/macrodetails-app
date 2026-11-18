// Public surface of the storage module (see docs/adr/0002, rule 2).
export { StorageModule } from './storage.module.js';
export { ObjectStorage, StorageNotConfiguredError } from './domain/object-storage.js';
export type { PutObjectInput, UploadUrl, UploadUrlInput } from './domain/object-storage.js';
