# Security Review

Date: 2026-06-22

Scope: `frontend/`, `backend/`, root project configuration, and the media upload/Cloudinary flow.

## Fixed Issues

1. Public media write endpoints

   Upload and delete routes now use `ADMIN_UPLOAD_TOKEN` through `backend/middleware/adminAuth.js`. In production, writes are disabled if the token is missing.

2. Video-only upload validation

   Multer now accepts only explicit image/video MIME types and rejects unsupported uploads with HTTP 415. The shared media API records whether the asset is an image or video.

3. Unsafe upload of Git LFS pointer files

   `backend/scripts/seedMedia.js` detects Git LFS pointer files and skips them so a 136-byte pointer cannot be uploaded to Cloudinary as a fake video.

4. Node certificate trust mismatch

   Cloudinary uploads failed with `unable to get local issuer certificate` because Node used its bundled CA store while the Windows system store trusted the issuer. Cloudinary-facing npm scripts now run Node with `--use-system-ca`.

5. Large video upload timeout

   The 40 MB demo video timed out with Cloudinary's regular upload stream. Local seed uploads now use Cloudinary chunked upload for large videos.

6. Dependency advisories

   `npm audit fix` cleared backend Express/qs/brace-expansion advisories. Frontend esbuild was pinned through an npm override to clear the dev-server advisory.

7. Overly broad static/root layout

   Frontend files moved into `frontend/`; backend serves `frontend/dist` only after build. Generated dependency, build, env, and data files are ignored.

## Current Results

- Backend audit: 0 vulnerabilities.
- Frontend audit: 0 vulnerabilities.
- Backend tests: 14 passing.
- Frontend tests: 2 passing.
- Production frontend build: passing.

## Residual Notes

- Cloudinary media seed completed for all 7 portfolio assets after switching to system CA trust, chunked video upload, and optimized image size.
- A full formal Codex Security exhaustive scan with subagents was not run because the security-scan workflow requires explicit subagent authorization.
