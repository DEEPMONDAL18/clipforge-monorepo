import fs from 'fs';
import fsPromises from 'fs/promises';
import path from 'path';
import { pipeline } from 'stream/promises';
import { IStorageProvider, StorageSaveOptions } from './storage-provider.interface.js';

export class LocalStorageProvider implements IStorageProvider {
  private readonly baseStorageDir: string;
  private readonly tempUploadsDir: string;
  private readonly finalUploadsDir: string;

  constructor(baseStorageDir = './storage') {
    this.baseStorageDir = baseStorageDir;
    this.tempUploadsDir = path.join(this.baseStorageDir, 'temp', 'uploads');
    this.finalUploadsDir = path.join(this.baseStorageDir, 'uploads');
  }

  public async saveFile(
    fileStream: NodeJS.ReadableStream | Buffer,
    targetPath: string,
    _options?: StorageSaveOptions
  ): Promise<string> {
    const fullPath = path.resolve(this.baseStorageDir, targetPath);
    await fsPromises.mkdir(path.dirname(fullPath), { recursive: true });

    if (Buffer.isBuffer(fileStream)) {
      await fsPromises.writeFile(fullPath, fileStream);
    } else {
      const writeStream = fs.createWriteStream(fullPath);
      await pipeline(fileStream, writeStream);
    }

    return fullPath;
  }

  public async saveChunk(
    uploadId: string,
    chunkIndex: number,
    chunkData: Buffer
  ): Promise<void> {
    const chunkDir = path.join(this.tempUploadsDir, uploadId);
    await fsPromises.mkdir(chunkDir, { recursive: true });

    const chunkFilePath = path.join(chunkDir, `chunk_${chunkIndex}.part`);
    await fsPromises.writeFile(chunkFilePath, chunkData);
  }

  public async getUploadedChunkIndices(uploadId: string): Promise<readonly number[]> {
    const chunkDir = path.join(this.tempUploadsDir, uploadId);
    try {
      const files = await fsPromises.readdir(chunkDir);
      const indices: number[] = [];

      for (const file of files) {
        const match = /^chunk_(\d+)\.part$/.exec(file);
        if (match && match[1]) {
          indices.push(parseInt(match[1], 10));
        }
      }

      return indices.sort((a, b) => a - b);
    } catch (err) {
      if ((err as NodeJS.ErrnoException).code === 'ENOENT') {
        return [];
      }
      throw err;
    }
  }

  public async mergeChunks(
    uploadId: string,
    totalChunksCount: number,
    destinationPath: string
  ): Promise<number> {
    const chunkDir = path.join(this.tempUploadsDir, uploadId);
    const fullDestPath = path.resolve(this.finalUploadsDir, destinationPath);
    await fsPromises.mkdir(path.dirname(fullDestPath), { recursive: true });

    const writeStream = fs.createWriteStream(fullDestPath);
    let totalBytesWritten = 0;

    for (let index = 0; index < totalChunksCount; index++) {
      const chunkPath = path.join(chunkDir, `chunk_${index}.part`);
      const stat = await fsPromises.stat(chunkPath);
      totalBytesWritten += stat.size;

      const readStream = fs.createReadStream(chunkPath);
      for await (const chunk of readStream) {
        if (!writeStream.write(chunk)) {
          await new Promise<void>((resolve) => writeStream.once('drain', () => resolve()));
        }
      }
    }

    await new Promise<void>((resolve, reject) => {
      writeStream.on('error', (err: Error) => reject(err));
      writeStream.end(() => resolve());
    });

    return totalBytesWritten;
  }

  public async deleteChunkDirectory(uploadId: string): Promise<void> {
    const chunkDir = path.join(this.tempUploadsDir, uploadId);
    await fsPromises.rm(chunkDir, { recursive: true, force: true });
  }

  public async deleteFile(targetPath: string): Promise<void> {
    const fullPath = path.resolve(this.baseStorageDir, targetPath);
    await fsPromises.rm(fullPath, { force: true });
  }

  public async fileExists(targetPath: string): Promise<boolean> {
    const fullPath = path.resolve(this.baseStorageDir, targetPath);
    try {
      await fsPromises.access(fullPath);
      return true;
    } catch {
      return false;
    }
  }

  public async getDownloadUrl(targetPath: string, _expiresInSeconds = 3600): Promise<string> {
    return `/api/v1/download/${encodeURIComponent(targetPath)}`;
  }

  public async deleteDirectory(dirPath: string): Promise<void> {
    const fullPath = path.resolve(this.baseStorageDir, dirPath);
    await fsPromises.rm(fullPath, { recursive: true, force: true });
  }
}
