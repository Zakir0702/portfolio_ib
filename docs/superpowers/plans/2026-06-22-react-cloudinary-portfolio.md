# React Cloudinary Portfolio Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the portfolio as a React frontend with a structured backend that uploads media to Cloudinary via Multer and serves dynamic media links to the site.

**Architecture:** Keep `frontend/` and `backend/` as independent packages. The backend owns upload, Cloudinary integration, JSON metadata persistence, input validation, and static serving for production. The frontend owns React rendering, reusable components, portfolio data, API-backed media loading, modals, theme, and animations.

**Tech Stack:** React + Vite, plain CSS modules/global CSS, Express, Multer memory storage, Cloudinary SDK, Node test runner, Supertest-style HTTP tests if available or direct module tests if not.

---

### Task 1: Backend Media API Foundation

**Files:**
- Modify: `backend/server.js`
- Modify: `backend/routes/videoRoutes.js`
- Modify: `backend/middleware/upload.js`
- Modify: `backend/utils/videoStore.js`
- Create: `backend/utils/mediaStore.js`
- Create: `backend/utils/cloudinaryUpload.js`
- Create: `backend/tests/mediaStore.test.js`
- Create: `backend/tests/upload.test.js`

- [ ] **Step 1: Write failing tests for normalized media records**

Test that image and video records are persisted as `type`, `title`, `url`, `poster`, `public_id`, `format`, `size`, and `created_at`.

- [ ] **Step 2: Run tests and confirm failure**

Run: `npm test -- --runInBand` from `backend/` or `node --test tests/*.test.js` if using Node's built-in runner.

- [ ] **Step 3: Implement media store and upload helper**

Move from video-only storage to media-aware storage while keeping `/api/videos` backward-compatible.

- [ ] **Step 4: Add safe upload validation**

Allow images and videos, reject unexpected MIME types, cap file size, sanitize title/category, and return JSON errors without stack traces.

- [ ] **Step 5: Run backend tests and syntax checks**

Run: `node --check server.js`, `node --check routes/videoRoutes.js`, and `node --test`.

### Task 2: Cloudinary Seeding Flow

**Files:**
- Create: `backend/scripts/seedMedia.js`
- Modify: `backend/package.json`
- Modify: `backend/.env.example`

- [ ] **Step 1: Write failing test for seed manifest handling**

Test that a local media manifest maps local files into upload payloads without uploading when `--dry-run` is used.

- [ ] **Step 2: Implement `npm run seed:media`**

The script should upload local images/videos to Cloudinary when credentials are present, write Cloudinary URLs into the media store, and support `--dry-run`.

- [ ] **Step 3: Run dry-run against current local assets**

Run: `npm run seed:media -- --dry-run`.

### Task 3: React Frontend Restructure

**Files:**
- Create: `frontend/package.json`
- Create: `frontend/index.html`
- Create: `frontend/src/main.jsx`
- Create: `frontend/src/App.jsx`
- Create: `frontend/src/api/media.js`
- Create: `frontend/src/data/portfolio.js`
- Create: `frontend/src/components/*.jsx`
- Create: `frontend/src/styles.css`
- Move/copy assets into: `frontend/public/assets/`

- [ ] **Step 1: Write failing frontend tests for API fallback**

Test that media helpers return backend media when available and fall back to local portfolio media when the API is unavailable.

- [ ] **Step 2: Create React app structure**

Split the existing single HTML page into focused React components: `Navbar`, `Hero`, `ToolsMarquee`, `About`, `Working`, `Services`, `Projects`, `Testimonials`, `Brands`, `Reel`, `Footer`, and modal components.

- [ ] **Step 3: Preserve current visual design**

Port the current CSS into `frontend/src/styles.css`, changing asset paths to `/assets/...` and preserving responsive/dark-mode behavior.

- [ ] **Step 4: Wire dynamic media**

Fetch `/api/media`, map Cloudinary URLs by `key/category`, and use local fallback URLs when Cloudinary data is missing.

- [ ] **Step 5: Build and smoke-test**

Run: `npm run build` from `frontend/`.

### Task 4: Production Integration

**Files:**
- Modify: `backend/server.js`
- Modify: `backend/package.json`
- Create or modify: root `package.json`

- [ ] **Step 1: Serve frontend build from backend**

Backend should serve `frontend/dist` in production and keep API under `/api`.

- [ ] **Step 2: Add root scripts**

Add scripts for `install:all`, `dev`, `build`, `start`, and `test` if practical.

- [ ] **Step 3: Validate full app**

Run backend, open the built app, confirm API health and portfolio rendering.

### Task 5: Security Scan and Fixes

**Files:**
- Review every source file excluding generated dependencies.
- Modify backend/frontend files as needed.
- Create scan artifacts under `.codex/security-scans/`.

- [ ] **Step 1: Threat model**

Identify trust boundaries: browser, upload endpoint, Cloudinary, JSON file store, static asset serving, and environment variables.

- [ ] **Step 2: Finding discovery**

Review upload validation, CORS, static serving, XSS surfaces from dynamic data, file persistence, secrets, and dependency risk.

- [ ] **Step 3: Validation**

Reproduce or reason about each candidate. Suppress non-exploitable items with evidence.

- [ ] **Step 4: Fix root causes**

Implement fixes for confirmed issues, especially unrestricted CORS, unguarded delete/upload routes, unsafe MIME trust, and dynamic content rendering.

- [ ] **Step 5: Final reports**

Write markdown and HTML security reports and include remaining risks.

### Task 6: Final Verification

**Files:**
- All changed files.

- [ ] **Step 1: Run syntax/test/build checks**

Run backend checks, frontend tests/build, and root scripts where available.

- [ ] **Step 2: Run local app**

Verify desktop and mobile render, modals, theme toggle, video URL behavior, and API fallback.

- [ ] **Step 3: Produce handoff**

Report what changed, what was verified, what still depends on Cloudinary credentials or Git LFS, and provide a commit message.

