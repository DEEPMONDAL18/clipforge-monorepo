# ENG-009 Change Log: Application Pages Migration

**Ticket ID:** ENG-009  
**Date:** 2026-08-10  
**Target Repository:** `Clipping Software` (Primary Monorepo)  
**Reference Repository:** `clipforge-frontend` (Read-only Reference)

---

## 1. Added Files

### `frontend/src/components/landing/`

- `Hero.tsx` — Restrained landing hero section with key value propositions (`No re-encoding`, `Files up to 20 GB`, `Deleted after 1 hour`).
- `Features.tsx` — Capability features grid displaying six core capability cards.
- `Faq.tsx` — Frequently asked questions section built using Radix UI `Accordion` primitive.

### `frontend/src/components/workspace/`

- `Workspace.tsx` — Main interactive workspace container orchestrating pipeline phase views.
- `UploadCard.tsx` — Drag-and-drop file upload interface supporting format & size validation.
- `UploadMonitor.tsx` — Live transfer monitor featuring progress percentage, byte counts, speed, and time remaining.
- `VideoMetadataCard.tsx` — Extracted video metadata summary card (duration, resolution, codecs, frame rate, estimated clips & processing time).
- `ClipSettingsCard.tsx` — Clip length preset & custom duration configuration card with `react-hook-form` and `zod` validation.
- `QueueCard.tsx` — Worker queue waiting status card showing position and estimated wait time.
- `ProgressCard.tsx` — Processing monitor card with progress percentage, stage indicator, clip counts, and ETA.
- `PipelineTimeline.tsx` — Horizontal six-stage pipeline status timeline (`upload` → `metadata` → `queue` → `processing` → `zip` → `ready`).
- `ActivityTimeline.tsx` — Chronological activity log feed displaying pipeline events.
- `CompletionCard.tsx` — Processing completion summary card.
- `DownloadPanel.tsx` — Download panel rendering individual clips and full ZIP archive download actions.
- `ExpiryCard.tsx` — Live countdown timer card displaying time remaining before ephemeral file deletion (countdown logic embedded locally).
- `ExpiredCard.tsx` — Post-retention expiry state notification card.
- `JobDetailsCard.tsx` — Support and debugging technical summary card.
- `ErrorPanel.tsx` — Error presentation and recovery action panel.

---

## 2. Modified Files

- `frontend/src/pages/HomePage.tsx` — Migrated to compose `<Hero />`, `<Workspace />`, `<Features />`, and `<Faq />` using ENG-007 UI components and ENG-008 layout shell.
- `frontend/src/pages/JobStatusPage.tsx` — Migrated to render workspace job status presentation using domain types (`Job`, `ClipArtifact`, `ArchiveArtifact`, `ActivityEvent`).

---

## 3. Scope Boundaries Maintained

- `backend/` — **UNTOUCHED (0 changes)**
- `packages/shared/` — **UNTOUCHED (0 changes)**
- `frontend/src/services/` — **UNTOUCHED (0 changes)**
- `frontend/src/hooks/` — **UNTOUCHED (0 changes)**

---

## 4. Verification Commands Executed

```bash
npm run type-check
npm run lint
npm run build
```

All verification commands executed cleanly with 0 type errors, 0 lint warnings/errors, and a successful production build.
