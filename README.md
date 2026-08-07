# ClipForge Engineering Monorepo

ClipForge is a professional, high-performance SaaS web application designed for lossless video splitting, clip management, temporary file lifecycle management, and ZIP archive downloads.

---

## Production Background Processing System

ClipForge features a production-grade asynchronous background job processing system built on BullMQ & Redis:

- **Decoupled Architecture**: HTTP REST API endpoints never execute heavy video processing tasks; jobs are enqueued with priority (`opts.priority: 1=VIP, 2=Normal, 3=Low`) and processed asynchronously by background workers.
- **Worker Infrastructure (`WorkerService`)**: Configurable concurrency (`WORKER_CONCURRENCY=2`), execution timeouts (`WORKER_JOB_TIMEOUT_MS=300000`), structured logging, and graceful `SIGTERM`/`SIGINT` shutdown.
- **Retry & Dead Letter Queue (DLQ)**: Jobs failing undergo exponential backoff retries (3 attempts, 5000ms initial delay). Jobs exhausting retries are routed to `video-processing-dlq` and updated to `JobStatus.FAILED`.
- **Job Lifecycle States**: `UPLOADING` $\rightarrow$ `QUEUED` $\rightarrow$ `WAITING_FOR_WORKER` $\rightarrow$ `PROCESSING` $\rightarrow$ `COMPLETED` / `READY` (or `CANCELLED` / `FAILED` / `EXPIRED`).
- **Job Cancellation**: `POST /api/v1/jobs/:id/cancel` sets cancellation tokens and removes waiting/in-flight jobs.
- **Queue Metrics**: `GET /api/v1/queue/stats` reports real-time active worker count and queue metrics.

---

## Production Resumable Upload System (`/api/v1/upload`)

ClipForge features a production-grade, highly resilient resumable chunked upload system designed for multi-gigabyte video files (5GB-10GB+):

- **Chunked Streaming**: Uploads chunks (Default `5 MB` size) via `PUT /api/v1/upload/:uploadId/chunk` with mandatory SHA-256 integrity verification (`X-Chunk-Checksum`).
- **Resumability**: Clients query `GET /api/v1/upload/:uploadId/status` to receive `uploadedChunkIndices` and `missingChunkIndices`.
- **Automatic Merge Detection**: Automatically detects when the final chunk lands, stream-merging chunks into `storage/uploads/{uploadId}/original.mp4` with $O(1)$ memory consumption.
- **Safe Cleanup**: Chunks are purged ONLY after FFprobe validates container readability and extracts metadata.

---

## Quickstart Commands

```bash
# Install all monorepo workspace dependencies
npm install

# Build shared package
npm run build:shared

# Run unit test suite (Resumable Upload & Background Processing)
NODE_ENV=test npm test

# Start local Redis container
npm run docker:up

# Run Backend in watch mode (http://localhost:4000)
npm run dev:backend

# Run Frontend in development mode (http://localhost:3000)
npm run dev:frontend

# Run strict TypeScript type-checking across workspace
npm run type-check

# Run ESLint compliance check (Zero 'any' rule enforced)
npm run lint
```

---

## Detailed Documentation Links

- 📖 [Architecture & Background System Overview](file:///Users/deepmondal/Developer/Clipping%20Software/docs/architecture.md)
- ⚙️ [Installation Guide](file:///Users/deepmondal/Developer/Clipping%20Software/docs/installation.md)
- 💻 [Development Workflow Guide](file:///Users/deepmondal/Developer/Clipping%20Software/docs/development.md)
- 📁 [Monorepo Folder Structure Dictionary](file:///Users/deepmondal/Developer/Clipping%20Software/docs/folder-structure.md)
