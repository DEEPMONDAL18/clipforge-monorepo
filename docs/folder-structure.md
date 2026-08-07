# ClipForge Monorepo Folder Structure Dictionary

```text
clipforge/
├── .github/
│   └── workflows/
│       └── ci.yml               # GitHub Actions CI workflow for linting & building
├── packages/
│   └── shared/                  # @clipforge/shared Monorepo Package
│       ├── src/
│       │   ├── constants/       # Error code descriptions & mappings
│       │   ├── dto/             # Shared API DTO interfaces
│       │   ├── enums/           # Single source of truth enums (JobStatus: UPLOADING, QUEUED, WAITING_FOR_WORKER, PROCESSING, COMPLETED, CANCELLED, etc.)
│       │   ├── types/           # Shared types (ApiResponse, ClipInfo, JobMetadata)
│       │   └── index.ts
│       ├── package.json
│       └── tsconfig.json
├── backend/
│   ├── src/
│   │   ├── config/              # Env loaders, constants, logger setup
│   │   ├── controllers/         # Fastify route controllers
│   │   │   ├── download.controller.ts
│   │   │   ├── job.controller.ts
│   │   │   ├── queue.controller.ts            # Queue stats & cancel controller
│   │   │   ├── resumable-upload.controller.ts # Resumable Upload Controller
│   │   │   └── upload.controller.ts
│   │   ├── events/              # Domain Event definitions & IEventBus interface
│   │   ├── ffmpeg/              # FFmpeg & FFprobe interfaces and wrappers
│   │   ├── jobs/                # Job workflow orchestrators (Worker -> Job -> Service)
│   │   │   ├── base.job.ts
│   │   │   ├── cleanup.job.ts
│   │   │   ├── video-processing.job.ts        # VideoProcessingJob orchestrator
│   │   │   └── zip-generation.job.ts
│   │   ├── middleware/          # Security, error handler, and request validation
│   │   ├── queue/               # BullMQ queues (videoProcessingQueue, videoProcessingDLQ, cleanupQueue)
│   │   │   ├── queue.config.ts
│   │   │   └── video-queue.ts
│   │   ├── routes/              # Fastify API v1 endpoint definitions
│   │   │   ├── download.routes.ts
│   │   │   ├── index.ts
│   │   │   ├── job.routes.ts
│   │   │   ├── queue.routes.ts                # Queue management routes (/api/v1/jobs/:id/cancel, /api/v1/queue/stats)
│   │   │   ├── resumable-upload.routes.ts
│   │   │   └── upload.routes.ts
│   │   ├── services/            # Domain service implementations
│   │   │   ├── cleanup.service.ts
│   │   │   ├── ffmpeg.service.ts
│   │   │   ├── queue.service.ts              # QueueService (Enqueue, Priority, Cancel, DLQ)
│   │   │   ├── resumable-upload.service.ts
│   │   │   ├── supabase.service.ts
│   │   │   ├── upload.service.ts
│   │   │   ├── video.service.ts
│   │   │   ├── worker.service.ts             # WorkerService (BullMQ Workers, Concurrency, Shutdown)
│   │   │   └── zip.service.ts
│   │   ├── storage/             # Storage provider interface & local implementation
│   │   ├── tests/               # Unit test suites
│   │   │   ├── background-processing.test.ts  # Background Processing Unit Tests
│   │   │   └── resumable-upload.test.ts       # Resumable Upload Unit Tests
│   │   ├── types/               # Fastify type augmentations & re-exports
│   │   ├── utils/               # Custom errors, response formatting, log helper
│   │   ├── workers/             # Background worker entrypoints
│   │   ├── app.ts               # Fastify app setup & DI decorator registration
│   │   └── server.ts            # Entrypoint server execution & graceful SIGTERM listener
│   ├── .env.example             # Backend environment template
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/                     # React + Vite Client Application
│   ├── .env.example
│   ├── package.json
│   └── vite.config.ts
├── storage/                     # Centralized project root runtime storage
├── docker/
├── docker-compose.yml
├── eslint.config.js
├── package.json
├── tsconfig.base.json
└── README.md
```
