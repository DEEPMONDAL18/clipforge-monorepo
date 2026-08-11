import { ArchiveArtifact, ClipArtifact } from '@clipforge/shared';
import { ApiClient } from './api.client.js';

export class DownloadService {
  public static async resolveArchiveUrl(jobId: string, archive: ArchiveArtifact): Promise<string> {
    if (archive.downloadUrl.startsWith('http')) {
      return archive.downloadUrl;
    }
    const response = await ApiClient.get<{ url: string }>(`/jobs/${jobId}/archive`);
    return response.url;
  }

  public static async resolveClipUrl(jobId: string, clip: ClipArtifact): Promise<string> {
    if (clip.downloadUrl.startsWith('http')) {
      return clip.downloadUrl;
    }
    const response = await ApiClient.get<{ url: string }>(`/jobs/${jobId}/clips/${clip.id}`);
    return response.url;
  }

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
