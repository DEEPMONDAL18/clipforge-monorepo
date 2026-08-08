# ENG-008 Change Log: Layout & Navigation Migration

**Ticket ID:** ENG-008  
**Date:** 2026-08-08  
**Target Repository:** `Clipping Software` (Primary Monorepo)  
**Reference Repository:** `clipforge-frontend` (Read-only Reference)

---

## 1. Added Files

### `frontend/src/components/layout/`

- `ClipForgeMark.tsx` — SVG geometric wordmark representing a film frame split into clips.
- `Navbar.tsx` — Sticky application header containing `ClipForgeMark`, brand title, external GitHub repository link button, and `ThemeToggle`.
- `Footer.tsx` — Global application footer displaying copyright information, legal links (`Privacy`, `Terms`, `GitHub`), and `APP_VERSION`.
- `ThemeToggle.tsx` — Theme toggle control reusing ENG-007 `Button` primitive and `useTheme` hook.

### `frontend/src/hooks/`

- `useTheme.ts` — Theme management hook supporting dark and light themes with `localStorage` persistence (`clipforge-theme`).

---

## 2. Modified Files

- `frontend/src/layouts/MainLayout.tsx` — Updated structural layout shell to compose `Navbar` and `Footer` surrounding `{children}` content slot.

---

## 3. Files Intentionally Not Migrated (ENG-009 Scope)

- Application pages (`HomePage.tsx`, `JobStatusPage.tsx`)
- Landing page sections (`HeroSection`, `FeaturesGrid`, `WorkflowSteps`, `UploadZone`)
- Workspace application screens and clip processing views

---

## 4. Dependencies Added / Removed

- **Added Dependencies:** 0
- **Removed Dependencies:** 0

---

## 5. Verification Commands Executed

```bash
npm run type-check
npm run lint
npm run build
```

All verification commands executed cleanly with 0 type errors, 0 lint warnings/errors, and a successful production build in 972ms.
