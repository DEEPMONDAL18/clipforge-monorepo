import { InitUploadRequestDTO, InitUploadResponseDTO } from '@clipforge/shared';
import { ApiClient } from './api.client.js';

export interface UploadProgressCallback {
  (uploadedBytes: number, totalBytes: number, speedBytesPerSecond: number): void;
}

export class UploadService {
  public static async initUpload(payload: InitUploadRequestDTO): Promise<InitUploadResponseDTO> {
    return ApiClient.post<InitUploadResponseDTO, InitUploadRequestDTO>('/upload', payload);
  }

  public static async uploadChunk(
    uploadId: string,
    chunkIndex: number,
    chunkData: Blob,
    options?: { signal?: AbortSignal }
  ): Promise<void> {
    const formData = new FormData();
    formData.append('chunkIndex', String(chunkIndex));
    formData.append('file', chunkData);

    const baseUrl = ApiClient.getBaseUrl();
    const init: RequestInit = {
      method: 'POST',
      body: formData
    };
    if (options?.signal) {
      init.signal = options.signal;
    }

    const response = await fetch(`${baseUrl}/upload/${uploadId}/chunks`, init);

    if (!response.ok) {
      throw new Error(`Uploading chunk ${chunkIndex} failed with status ${response.status}`);
    }
  }

  public static async completeUpload(uploadId: string): Promise<{ jobId: string }> {
    return ApiClient.post<{ jobId: string }>(`/upload/${uploadId}/complete`);
  }

  public static async abortUpload(uploadId: string): Promise<void> {
    await ApiClient.delete(`/upload/${uploadId}`);
  }

  public static async uploadVideoFile(
    _uploadUrl: string,
    file: File,
    onProgress?: UploadProgressCallback
  ): Promise<void> {
    if (onProgress) {
      onProgress(file.size, file.size, 1024 * 1024);
    }
  }
}
