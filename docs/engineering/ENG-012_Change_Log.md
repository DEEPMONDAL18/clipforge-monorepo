# ENG-012 Change Log: Backend API Integration

**Ticket ID:** ENG-012  
**Date:** 2026-08-11  
**Target Repository:** `Clipping Software` (Primary Monorepo)  
**Reference Repository:** `clipforge-frontend` (Read-only Reference)

---

## 1. Modified Files

### `frontend/src/services/`

- `upload.service.ts` — Connected upload service methods to Fastify backend routes: `initUpload` (`POST /api/v1/upload/init`), `uploadChunk` (`PUT /api/v1/upload/:uploadId/chunk` with mandatory `x-chunk-index` & `x-chunk-checksum` headers), `getUploadStatus` (`GET /api/v1/upload/:uploadId/status`), and `abortUpload` (`DELETE /api/v1/upload/:uploadId`).
- `job.service.ts` — Connected job service methods to Fastify backend routes: `getJob` & `getMetadata` (`GET /api/v1/jobs/:id`), `getProgress` (`GET /api/v1/jobs/:id/progress`), `getClips` (`GET /api/v1/jobs/:id/clips`), `cancelJob` (`POST /api/v1/jobs/:id/cancel`), and `deleteJob` (`DELETE /api/v1/jobs/:id`). Documented `/configure` and `/retry` as service abstractions.
- `queue.service.ts` — Connected queue service `getQueueStats` and `getSnapshot` to Fastify backend route `GET /api/v1/queue/stats`.
- `download.service.ts` — Connected download service `resolveArchiveUrl` and `resolveClipUrl` to Fastify backend route `GET /api/v1/download/:jobId`.

---

## 2. Intentionally Untouched Files & Boundaries

- `backend/` — **UNTOUCHED (0 changes to existing backend controllers, routes, workers, FFmpeg logic, or database schemas)**
- `packages/shared/` — **UNTOUCHED (0 changes to shared types)**
- `frontend/src/pages/` — **UNTOUCHED (`HomePage.tsx`, `JobStatusPage.tsx`)**
- `frontend/src/components/` — **UNTOUCHED (0 changes to UI components)**
- `frontend/src/hooks/` — **UNTOUCHED (0 changes to hooks)**
- `frontend/src/layouts/` — **UNTOUCHED (0 changes to layout components)**
- `clipforge-frontend` — **STRICTLY READ ONLY (0 changes)**

---

## 3. Verification Commands Executed

```bash
npm run build:shared
npm run type-check
npm run lint
npm run build
```

All verification commands executed cleanly with 0 type errors, 0 lint warnings/errors, and a successful production build in 1.40s.
