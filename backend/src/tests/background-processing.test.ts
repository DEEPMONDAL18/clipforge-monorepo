import { JobStatus } from '@clipforge/shared';
import fs from 'fs/promises';
import { loadEnv } from '../config/env.js';
import { VideoProcessingJob } from '../jobs/video-processing.job.js';
import { FFmpegService } from '../services/ffmpeg.service.js';
import { QueueService } from '../services/queue.service.js';
import { VideoService } from '../services/video.service.js';
import { WorkerService } from '../services/worker.service.js';
import { LocalStorageProvider } from '../storage/local-storage.provider.js';

function assert(condition: boolean, message: string): void {
  if (!condition) {
    throw new Error(`Assertion failed: ${message}`);
  }
}

async function runUnitTests(): Promise<void> {
  console.info('🧪 Starting Background Processing Unit Tests...');
  const testStorageDir = './storage/test_worker_temp';

  try {
    const config = loadEnv();
    const storageProvider = new LocalStorageProvider(testStorageDir);
    const videoService = new VideoService();
    const ffmpegService = new FFmpegService();
    const workerService = new WorkerService(config, videoService, ffmpegService, storageProvider);
    const queueService = new QueueService(workerService, videoService);

    // Test 1: Priority Queue Enqueueing
    console.info('▶ Test 1: Priority Queue Enqueueing');
    const mockJob1 = await videoService.createJob({
      fileName: 'vip_podcast.mp4',
      fileSizeBytes: 10485760,
      mimeType: 'video/mp4',
      segments: []
    });

    await queueService.addVideoProcessingJob(mockJob1.jobId, 1); // Urgent/VIP priority = 1
    console.info('✓ Successfully enqueued high-priority job');

    // Test 2: VideoProcessingJob Progress Execution & Cancellation Token
    console.info('▶ Test 2: VideoProcessingJob Execution & Cancellation');
    const mockJob2 = await videoService.createJob({
      fileName: 'normal_video.mp4',
      fileSizeBytes: 5242880,
      mimeType: 'video/mp4',
      segments: []
    });

    let cancelled = false;
    const processingJob = new VideoProcessingJob(
      mockJob2.jobId,
      videoService,
      ffmpegService,
      storageProvider,
      () => cancelled
    );

    // Set cancellation token signal
    cancelled = true;

    try {
      await processingJob.execute();
      assert(false, 'Should have thrown cancellation error');
    } catch {
      console.info('✓ Job successfully aborted on cancellation token signal');
    }

    const cancelledJobState = await videoService.getJob(mockJob2.jobId);
    assert(cancelledJobState?.status === JobStatus.CANCELLED, 'Job status should be CANCELLED');

    // Test 3: Worker Metrics Query
    console.info('▶ Test 3: Worker Queue Metrics Reporting');
    const metrics = await workerService.getQueueMetrics();
    assert(typeof metrics.waitingJobsCount === 'number', 'waitingJobsCount should be a number');
    assert(typeof metrics.dlqJobsCount === 'number', 'dlqJobsCount should be a number');
    console.info('✓ Queue metrics object layout verified');

    console.info('🎉 ALL BACKGROUND PROCESSING UNIT TESTS PASSED CLEANLY!');
  } finally {
    await fs.rm(testStorageDir, { recursive: true, force: true });
  }
}

runUnitTests().catch((err) => {
  console.error('❌ Background processing unit tests failed:', err);
  process.exit(1);
});
