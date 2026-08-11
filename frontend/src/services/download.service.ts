import { ArchiveArtifact, ClipArtifact } from '@clipforge/shared';
import { ApiClient } from './api.client.js';

export interface DownloadArtifactResponse {
  jobId: string;
  downloadType: 'ZIP_ARCHIVE' | 'INDIVIDUAL_CLIP';
  clipId: string | null;
  fileName: string;
  downloadUrl: string;
  expiresInSeconds: number;
}

export class DownloadService {
  /**
   * Resolves full ZIP archive download URL via backend route GET /api/v1/download/:jobId?archive=true
   */
  public static async resolveArchiveUrl(jobId: string, archive?: ArchiveArtifact): Promise<string> {
    if (archive?.downloadUrl && archive.downloadUrl.startsWith('http')) {
      return archive.downloadUrl;
    }
    const result = await ApiClient.get<DownloadArtifactResponse>(`/download/${jobId}?archive=true`);
    return result.downloadUrl;
  }

  /**
   * Resolves individual clip download URL via backend route GET /api/v1/download/:jobId?clipId=:clipId
   */
  public static async resolveClipUrl(jobId: string, clip: ClipArtifact): Promise<string> {
    if (clip.downloadUrl && clip.downloadUrl.startsWith('http')) {
      return clip.downloadUrl;
    }
    const result = await ApiClient.get<DownloadArtifactResponse>(
      `/download/${jobId}?clipId=${clip.id}`
    );
    return result.downloadUrl;
  }

  /**
   * Triggers an anchor download element in browser DOM.
   */
  public static triggerDownload(url: string, filename: string): void {
    if (typeof document === 'undefined') return;
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = filename;
    anchor.rel = 'noopener';
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
  }
}
