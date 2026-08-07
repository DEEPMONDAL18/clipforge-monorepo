export interface IStorageProvider {
  saveFile(fileStream: NodeJS.ReadableStream, targetPath: string): Promise<string>;
  deleteFile(filePath: string): Promise<void>;
  fileExists(filePath: string): Promise<boolean>;
  getDownloadUrl(filePath: string): Promise<string>;
  deleteDirectory(dirPath: string): Promise<void>;
}
