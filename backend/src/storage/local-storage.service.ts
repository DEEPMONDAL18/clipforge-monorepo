import { IStorageProvider } from './storage.interface.js';

export class LocalStorageService implements IStorageProvider {
  public async saveFile(
    _fileStream: NodeJS.ReadableStream,
    _targetPath: string
  ): Promise<string> {
    // TODO: Implement stream writing to target path on disk
    return _targetPath;
  }

  public async deleteFile(_filePath: string): Promise<void> {
    // TODO: Implement fs.unlink logic for single file deletion
  }

  public async fileExists(_filePath: string): Promise<boolean> {
    // TODO: Implement fs.access verification
    return true;
  }

  public async getDownloadUrl(_filePath: string): Promise<string> {
    // TODO: Implement local storage URL generator
    return `/api/download/${encodeURIComponent(_filePath)}`;
  }

  public async deleteDirectory(_dirPath: string): Promise<void> {
    // TODO: Implement recursive directory cleanup via fs.rm
  }
}
