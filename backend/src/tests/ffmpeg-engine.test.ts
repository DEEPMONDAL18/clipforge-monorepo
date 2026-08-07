import fs from 'fs/promises';
import path from 'path';
import { loadEnv } from '../config/env.js';
import { FFmpegCommandBuilder } from '../ffmpeg/ffmpeg-command.builder.js';
import { SegmentPlanner } from '../ffmpeg/segment-planner.js';
import { VideoProcessingJob } from '../jobs/video-processing.job.js';
import { FFmpegService } from '../services/ffmpeg.service.js';
import { VideoService } from '../services/video.service.js';
import { ZipService } from '../services/zip.service.js';
import { LocalStorageProvider } from '../storage/local-storage.provider.js';

function assert(condition: boolean, message: string): void {
  if (!condition) {
    throw new Error(`Assertion failed: ${message}`);
  }
}

async function runUnitTests(): Promise<void> {
  console.info('🧪 Starting FFmpeg Engine & Segment Planner Unit Tests...');
  const testStorageDir = './storage/test_ffmpeg_temp';

  try {
    // Test 1: FFmpegCommandBuilder Argument Construction
    console.info('▶ Test 1: FFmpegCommandBuilder Argument Construction');
    const builder = new FFmpegCommandBuilder()
      .setInput('/path/to/input.mp4')
      .setOutput('/path/to/output.mp4')
      .setSeek(120, 60)
      .setStreamCopy();

    const args = builder.buildArgs();
    assert(args.includes('-ss'), 'args should include -ss seek flag');
    assert(args.includes('120'), 'args should specify 120 seek time');
    assert(args.includes('-c'), 'args should include stream copy flag');
    assert(args.includes('copy'), 'args should copy streams losslessly');
    assert(args[args.length - 1] === '/path/to/output.mp4', 'last arg must be output path');
    console.info('✓ FFmpegCommandBuilder args verified');

    // Test 2: SegmentPlanner Fixed Interval Calculations & Short Remainder Handling
    console.info('▶ Test 2: SegmentPlanner Algorithm Calculations');
    // 600s video split into 180s (3m) segments -> 3 full segments (180s, 180s, 180s) + 1 remainder (60s)
    const plans = SegmentPlanner.planFixedIntervalSegments(600, 180);
    assert(plans.length === 4, '600s split into 180s should yield 4 segment plans');
    assert(plans[0]?.durationSeconds === 180, 'Segment 1 duration should be 180s');
    assert(plans[3]?.durationSeconds === 60, 'Final segment duration should be 60s');

    // Negligible remainder test (600.4s split by 200s -> remainder 0.4s merged into segment 3)
    const shortRemainderPlans = SegmentPlanner.planFixedIntervalSegments(600.4, 200);
    assert(
      shortRemainderPlans.length === 3,
      '600.4s split by 200s should yield 3 segments (0.4s merged)'
    );
    assert(
      shortRemainderPlans[2]?.durationSeconds === 200.4,
      'Segment 3 duration includes 0.4s remainder'
    );
    console.info('✓ SegmentPlanner algorithm calculations verified');

    // Test 3: FFmpegService & ZipService Execution
    console.info('▶ Test 3: FFmpegService & ZipService Workflow');
    const ffmpegService = new FFmpegService();
    const zipService = new ZipService();

    const dummyDir = path.resolve(testStorageDir, 'dummy_clips');
    const clipPaths = await ffmpegService.splitVideoLossless('/path/to/input.mp4', dummyDir, [
      { startTimeSeconds: 0, endTimeSeconds: 60, title: 'Part 1' },
      { startTimeSeconds: 60, endTimeSeconds: 120, title: 'Part 2' }
    ]);

    assert(clipPaths.length === 2, 'splitVideoLossless should return 2 clip paths');

    const zipPath = await zipService.createClipsArchive('job_test_123', clipPaths);
    const zipExists = await fs
      .access(zipPath)
      .then(() => true)
      .catch(() => false);
    assert(zipExists, 'clips.zip archive file should exist on disk');
    console.info('✓ FFmpegService and ZipService workflow verified');

    // Test 4: VideoProcessingJob Workflow Execution
    console.info('▶ Test 4: VideoProcessingJob Complete Execution');
    const config = loadEnv();
    void config;
    const storageProvider = new LocalStorageProvider(testStorageDir);
    const videoService = new VideoService();

    const mockJob = await videoService.createJob({
      fileName: 'podcast.mp4',
      fileSizeBytes: 10485760,
      mimeType: 'video/mp4',
      segments: [{ startTimeSeconds: 0, endTimeSeconds: 60, title: 'Intro' }]
    });

    const job = new VideoProcessingJob(
      mockJob.jobId,
      videoService,
      ffmpegService,
      storageProvider,
      undefined,
      zipService
    );

    await job.execute();

    const finalState = await videoService.getJob(mockJob.jobId);
    assert(finalState?.status === 'READY', 'Job status should transition to READY on completion');
    console.info('✓ VideoProcessingJob complete execution verified');

    console.info('🎉 ALL FFMPEG ENGINE & SEGMENT PLANNER UNIT TESTS PASSED CLEANLY!');
  } finally {
    await fs.rm(testStorageDir, { recursive: true, force: true });
  }
}

runUnitTests().catch((err) => {
  console.error('❌ FFmpeg Engine unit test execution failed:', err);
  process.exit(1);
});
