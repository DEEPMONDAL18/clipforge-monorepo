export interface StorageSaveOptions {
  readonly contentType?: string;
  readonly metadata?: Record<string, string>;
}

/**
 * Storage Provider Abstraction Interface.
 * Standard interface supported by LocalStorageProvider, S3StorageProvider,
 * R2StorageProvider, AzureBlobStorageProvider, and GCSStorageProvider.
 */
export interface IStorageProvider {
  /**
   * Saves a binary stream or file buffer to target storage path key.
   */
  saveFile(
    fileStream: NodeJS.ReadableStream | Buffer,
    targetPath: string,
    options?: StorageSaveOptions
  ): Promise<string>;

  /**
   * Saves a single chunk part file.
   */
  saveChunk(uploadId: string, chunkIndex: number, chunkData: Buffer): Promise<void>;

  /**
   * Lists 0-indexed integer indices of all successfully stored chunks for uploadId.
   */
  getUploadedChunkIndices(uploadId: string): Promise<readonly number[]>;

  /**
   * Streams and merges chunk files sequentially into target destination path.
   * Returns total merged byte size.
   */
  mergeChunks(uploadId: string, totalChunksCount: number, destinationPath: string): Promise<number>;

  /**
   * Deletes temporary chunk folder for uploadId.
   */
  deleteChunkDirectory(uploadId: string): Promise<void>;

  /**
   * Permanently deletes a single file by target path key.
   */
  deleteFile(targetPath: string): Promise<void>;

  /**
   * Checks whether a file exists at the specified path key.
   */
  fileExists(targetPath: string): Promise<boolean>;

  /**
   * Generates a public or pre-signed download URL for a file.
   */
  getDownloadUrl(targetPath: string, expiresInSeconds?: number): Promise<string>;

  /**
   * Recursively purges a directory or prefix key path.
   */
  deleteDirectory(dirPath: string): Promise<void>;
}
