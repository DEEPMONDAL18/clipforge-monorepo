import { InitUploadRequestDTO, InitUploadResponseDTO } from '@clipforge/shared';
import { ApiClient } from './api.client.js';

export class UploadService {
  public static async initUpload(payload: InitUploadRequestDTO): Promise<InitUploadResponseDTO> {
    return ApiClient.post<InitUploadResponseDTO, InitUploadRequestDTO>('/upload', payload);
  }

  public static async uploadVideoFile(
    _uploadUrl: string,
    _file: File,
    _onProgress?: (percentage: number) => void
  ): Promise<void> {
    // TODO: Implement direct chunked upload via XHR / Fetch API to server / bucket
  }
}
