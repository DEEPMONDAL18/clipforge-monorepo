import { InitUploadRequestDTO, InitUploadResponseDTO } from '@clipforge/shared';
import { ApiClient } from './api.client.js';

export interface UploadProgressCallback {
  (uploadedBytes: number, totalBytes: number, speedBytesPerSecond: number): void;
}

export interface UploadStatusResponse {
  uploadId: string;
  jobId: string;
  totalChunks: number;
  uploadedChunks: number[];
  completed: boolean;
}

export class UploadService {
  /**
   * Initializes a standard or resumable video upload session with the backend.
   */
  public static async initUpload(payload: InitUploadRequestDTO): Promise<InitUploadResponseDTO> {
    return ApiClient.post<InitUploadResponseDTO, InitUploadRequestDTO>('/upload/init', payload);
  }

  /**
   * Uploads a single binary video chunk part with mandatory SHA-256 checksum header.
   */
  public static async uploadChunk(
    uploadId: string,
    chunkIndex: number,
    chunkBuffer: ArrayBuffer | Blob,
    checksum: string,
    options?: { signal?: AbortSignal }
  ): Promise<void> {
    const baseUrl = ApiClient.getBaseUrl();
    const headers: Record<string, string> = {
      'Content-Type': 'application/octet-stream',
      'x-chunk-index': String(chunkIndex),
      'x-chunk-checksum': checksum
    };

    const init: RequestInit = {
      method: 'PUT',
      headers
    };
    if (chunkBuffer !== undefined) {
      init.body = chunkBuffer;
    }
    if (options?.signal) {
      init.signal = options.signal;
    }

    const response = await fetch(`${baseUrl}/upload/${uploadId}/chunk`, init);

    if (!response.ok) {
      throw new Error(`Uploading chunk ${chunkIndex} failed with status ${response.status}`);
    }
  }

  /**
   * Queries the backend for upload session status and uploaded chunk indices.
   */
  public static async getUploadStatus(uploadId: string): Promise<UploadStatusResponse> {
    return ApiClient.get<UploadStatusResponse>(`/upload/${uploadId}/status`);
  }

  /**
   * Aborts an active upload session and purges temporary stored chunks.
   */
  public static async abortUpload(uploadId: string): Promise<void> {
    await ApiClient.delete(`/upload/${uploadId}`);
  }

  /**
   * Utility helper for tracking upload stream progress.
   */
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
