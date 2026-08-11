# ENG-011 Change Log: Service Layer

**Ticket ID:** ENG-011  
**Date:** 2026-08-11  
**Target Repository:** `Clipping Software` (Primary Monorepo)  
**Reference Repository:** `clipforge-frontend` (Read-only Reference)

---

## 1. Added Files

### `frontend/src/services/`

- `queue.service.ts` — `QueueService` class providing static methods (`getSnapshot`) for worker queue position and wait estimation polling.
- `download.service.ts` — `DownloadService` class providing static methods (`resolveArchiveUrl`, `resolveClipUrl`, `triggerDownload`) for clip/archive download URL resolution and DOM-based browser downloading.
- `index.ts` — Barrel export unifying `ApiClient`, `JobService`, `UploadService`, `QueueService`, and `DownloadService`.

---

## 2. Modified Files

### `frontend/src/services/`

- `api.client.ts` — Refined `ApiClient` with structured `ApiError` class, configurable `BASE_URL` (`import.meta.env.VITE_API_BASE_URL || '/api/v1'`), exactOptionalPropertyTypes compliance, and typed HTTP helpers (`GET`, `POST`, `PUT`, `DELETE`) consuming `@clipforge/shared` DTOs.
- `job.service.ts` — Refined `JobService` with methods (`getJob`, `getMetadata`, `getProgress`, `getClips`, `configureJob`, `retryJob`, `cancelJob`, `deleteJob`, `toJobError`) using canonical types from `@clipforge/shared`.
- `upload.service.ts` — Refined `UploadService` with methods (`initUpload`, `uploadChunk`, `completeUpload`, `abortUpload`, `uploadVideoFile`) using `InitUploadRequestDTO` and `InitUploadResponseDTO` from `@clipforge/shared`.

---

## 3. Scope Boundaries Maintained

- `backend/` — **UNTOUCHED (0 changes)**
- `packages/shared/` — **UNTOUCHED in ENG-011**
- `frontend/src/hooks/` — **UNTOUCHED (0 changes)**
- Application Pages & UI Components — **UNTOUCHED (0 changes)**
- `clipforge-frontend` reference repository — **UNTOUCHED (0 changes)**

---

## 4. Verification Commands Executed

```bash
npm run build:shared
npm run type-check
npm run lint
npm run build
```

All verification commands executed cleanly with 0 type errors, 0 lint warnings/errors, and a successful production build in 1.44s.
