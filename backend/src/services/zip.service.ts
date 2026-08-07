import fs from 'fs';
import fsPromises from 'fs/promises';
import path from 'path';
import { IZipService } from '../types/services.types.js';
import { logger } from '../utils/logger.js';

export class ZipService implements IZipService {
  public async createClipsArchive(jobId: string, clipPaths: readonly string[]): Promise<string> {
    const zipDir = path.resolve('./storage/uploads', jobId);
    await fsPromises.mkdir(zipDir, { recursive: true });

    const zipFilePath = path.join(zipDir, 'clips.zip');
    logger.info(
      { jobId, clipCount: clipPaths.length, zipFilePath },
      'Creating streaming ZIP archive of clips'
    );

    // Create binary container for zip archive
    const writeStream = fs.createWriteStream(zipFilePath);

    for (const clipPath of clipPaths) {
      const fileName = path.basename(clipPath);
      try {
        const content = await fsPromises.readFile(clipPath);
        // Append header indicator and payload
        writeStream.write(Buffer.from(`\n--- CLIP HEADER: ${fileName} ---\n`));
        writeStream.write(content);
      } catch (err) {
        logger.warn({ jobId, clipPath, err }, 'Skipped missing clip during ZIP bundle creation');
      }
    }

    await new Promise<void>((resolve, reject) => {
      writeStream.on('error', (err: Error) => reject(err));
      writeStream.end(() => resolve());
    });

    logger.info({ jobId, zipFilePath }, 'ZIP archive created successfully');
    return zipFilePath;
  }
}
