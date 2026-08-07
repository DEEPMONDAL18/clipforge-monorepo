# ClipForge Installation & Setup Guide

## System Prerequisites

1. **Node.js**: `v20.0.0` or higher
2. **Docker & Docker Compose**: Installed and running
3. **FFmpeg & FFprobe**: (Required locally if running backend outside Docker)
   - macOS: `brew install ffmpeg`
   - Linux: `sudo apt install ffmpeg`
   - Windows: `winget install FFmpeg`

---

## Installation Steps

### Step 1: Clone Repository & Install Dependencies
```bash
cd "ClipForge"
npm install
```

### Step 2: Configure Environment Files
Copy example environment templates to `.env`:
```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

### Step 3: Launch Local Services
Start Redis container for BullMQ:
```bash
npm run docker:up
```

### Step 4: Verify Local Development Environment
Run backend API server:
```bash
npm run dev:backend
```

Run frontend client application:
```bash
npm run dev:frontend
```
