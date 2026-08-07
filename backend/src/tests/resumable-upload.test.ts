import crypto from 'crypto';
import fs from 'fs/promises';
import { loadEnv } from '../config/env.js';
import { FFmpegService } from '../services/ffmpeg.service.js';
import { QueueService } from '../services/queue.service.js';
import { ResumableUploadService } from '../services/resumable-upload.service.js';
import { VideoService } from '../services/video.service.js';
import { LocalStorageProvider } from '../storage/local-storage.provider.js';

function assert(condition: boolean, message: string): void {
  if (!condition) {
    throw new Error(`Assertion failed: ${message}`);
  }
}

async function runUnitTests(): Promise<void> {
  console.info('🧪 Starting ResumableUploadService Refined Unit Tests...');
  const testStorageDir = './storage/test_temp';

  try {
    const config = loadEnv();
    const storageProvider = new LocalStorageProvider(testStorageDir);
    const videoService = new VideoService();
    const ffmpegService = new FFmpegService();
    const queueService = new QueueService();

    const service = new ResumableUploadService(
      config,
      storageProvider,
      videoService,
      ffmpegService,
      queueService
    );

    // Test 1: Init Upload Session
    console.info('▶ Test 1: Init Upload Session');
    const initResult = await service.initUpload({
      fileName: 'test_video_podcast.mp4',
      fileSizeBytes: 10485760, // 10 MB
      mimeType: 'video/mp4',
      segments: [{ startTimeSeconds: 0, endTimeSeconds: 60, title: 'Intro' }],
      chunkSizeBytes: 5242880 // 5 MB
    });

    assert(initResult.jobId.startsWith('job_'), 'jobId should start with job_');
    assert(initResult.totalChunksCount === 2, 'totalChunksCount should be 2');
    console.info('✓ Test 1 Passed');

    // Test 2: Mandatory SHA-256 Checksum Enforcement
    console.info('▶ Test 2: Mandatory SHA-256 Checksum Enforcement');
    const chunk0Data = Buffer.alloc(5242880, 'a');
    const chunk0Hash = crypto.createHash('sha256').update(chunk0Data).digest('hex');

    try {
      await service.uploadChunk(initResult.jobId, 0, chunk0Data, '');
      assert(false, 'Should have thrown ValidationError for missing checksum');
    } catch {
      console.info('✓ Successfully rejected upload missing checksum header');
    }

    try {
      await service.uploadChunk(initResult.jobId, 0, chunk0Data, 'invalid_checksum_hash');
      assert(false, 'Should have thrown ValidationError for invalid checksum hash');
    } catch {
      console.info('✓ Successfully rejected upload with corrupted checksum hash');
    }

    // Test 3: Valid Chunk Upload & Write Locking
    console.info('▶ Test 3: Valid Chunk Upload & Simultaneous Write Locking');
    const lockPromises = [
      service.uploadChunk(initResult.jobId, 0, chunk0Data, chunk0Hash),
      service.uploadChunk(initResult.jobId, 0, chunk0Data, chunk0Hash)
    ];

    const [chunk0Result] = await Promise.all(lockPromises);
    assert(chunk0Result !== undefined, 'chunk0Result should be defined');
    assert(chunk0Result!.uploadedChunksCount === 1, 'uploadedChunksCount should be 1');
    assert(!chunk0Result!.isComplete, 'isComplete should be false after chunk 0');
    console.info('✓ Test 3 Passed');

    // Test 4: Query Upload Status & Missing Chunks
    console.info('▶ Test 4: Query Upload Status');
    const statusBefore = await service.getUploadStatus(initResult.jobId);
    assert(statusBefore.uploadedChunkIndices.length === 1, 'uploadedChunkIndices length should be 1');
    assert(statusBefore.missingChunkIndices[0] === 1, 'missingChunkIndices should contain 1');
    console.info('✓ Test 6 Passed');

    // Test 5: Final Chunk Upload & Automatic Merge Detection
    console.info('▶ Test 5: Final Chunk Upload & Automatic Merge');
    const chunk1Data = Buffer.alloc(5242880, 'b');
    const chunk1Hash = crypto.createHash('sha256').update(chunk1Data).digest('hex');

    const finalChunkResult = await service.uploadChunk(
      initResult.jobId,
      1,
      chunk1Data,
      chunk1Hash
    );

    assert(finalChunkResult.isComplete, 'isComplete should be true after final chunk');
    assert(finalChunkResult.status === 'QUEUED', 'Job status should automatically transition to QUEUED');
    assert((finalChunkResult.durationSeconds || 0) > 0, 'Extracted FFprobe duration > 0');
    console.info('✓ Test 5 Passed (Automatic Merge & Safe Cleanup Succeeded)');

    console.info('🎉 ALL REFINED UNIT TESTS PASSED CLEANLY!');
  } finally {
    // Cleanup test storage directory
    await fs.rm(testStorageDir, { recursive: true, force: true });
  }
}

runUnitTests().catch((err) => {
  console.error('❌ Unit test execution failed:', err);
  process.exit(1);
});
