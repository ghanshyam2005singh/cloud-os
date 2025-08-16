# AI‑Powered Cloud OS

A web-native “desktop” that feels like an operating system: files, apps, terminal, notifications, multi-window UI, real-time collaboration, and an AI copilot baked into every surface. Built to showcase full-stack, systems, AI/ML, DevOps, and product thinking.

---

## Features (MVP)

- **Cloud Desktop**: Taskbar/dock, launcher, draggable/resizable windows, notifications.
- **File System**: Per-user namespaces, folders, upload/download, preview (txt, md, images, code), sharing via link.
- **Terminal**: Web terminal connected to per-user sandbox container; persistent home; resource quotas.
- **Code Editor**: Monaco-based editor with tabs, file tree, autosave, lint/format.
- **AI Copilot**: Inline code/composition assist, “Explain this file”, “Generate README”, “Write test”, “Run in terminal”.
- **Collaboration**: Presence cursors, file lock/soft-merge, shared terminals (view-only).
- **App Store**: Install first-party apps (Editor, Terminal, Notes, Gallery); manifest-based iframes/capsules.
- **Deploy Button**: One-click deploy selected folder to public URL (static hosting).

---

## Architecture

- **Frontend**: Next.js (App Router), React, Zustand/Redux Toolkit, TanStack Query, Tailwind, shadcn/ui, xterm.js, Monaco.
- **Gateway**: Fastify (TypeScript) or Go-Fiber (Go).
- **Services**: Auth, File System, AI, Sandbox Orchestrator, Deploy (microservices, monorepo).
- **Data Layer**: PostgreSQL (pgvector), Redis, MinIO (S3 API).
- **Infra**: Docker, Compose, Traefik/NGINX, OpenTelemetry, Prometheus, Grafana.

---

## Repo Layout

```
cloud-os/
  apps/
    web/            # Next.js frontend (UI, window manager, apps)
    gateway/        # Fastify API gateway (handles HTTP, auth, routing)
  services/
    auth/           # Authentication service (optional if not in gateway)
    fs/             # File system service (metadata, S3 proxy)
    ai/             # AI service (prompts, tools, embeddings)
    sandboxd/       # Container orchestrator (Go)
    deploy/         # Static deployer
  packages/
    ui/             # Shared UI components (design system)
    sdk/            # Typed client for gateway/services
    config/         # Shared config
  infra/
    docker/         # Dockerfiles for services + sandbox images
    compose/        # docker-compose*.yml for local dev
    k8s/            # Kubernetes manifests (future)
  docs/             # Documentation
  .github/workflows/# CI/CD pipelines
```

---

## Packages

   npm install -D tailwindcss postcss autoprefixer
   npx tailwindcss init -p
   npm install next react react-dom
   npx shadcn-ui@latest init
   npm install bcrypt jsonwebtoken prisma @prisma/client
   npx prisma init
   npm install postgres
   npm install @supabase/supabase-js
   npm i --save-dev @types/bcrypt
   npm install @monaco-editor/react

## Getting Started

1. **Clone the repo**  
   `git clone https://github.com/ghanshyam2005singh/cloud-os`

2. **Start local development stack**  
   ```bash
   docker compose -f infra/compose/dev.yml up
   ```

3. **Run Next.js frontend**  
   ```bash
   cd apps/web
   pnpm dev
   # or npm run dev
   ```

4. **Run API gateway**  
   ```bash
   cd apps/gateway
   pnpm dev
   ```

5. **MinIO Console**  
   Access at `localhost:9001`, create bucket `user-files`.

---

## Key APIs

- `POST /auth/login` → JWT
- `GET /me`
- `POST /files` (multipart upload)
- `GET /files/:id` (presigned URL)
- `PATCH /files/:id` (rename/move)
- `POST /files/:id/share` → share token
- `WS /terminal/:sandboxId/attach` (bidirectional TTY)
- `POST /sandbox` (create), `DELETE /sandbox/:id`
- `POST /ai/complete` (prompt, tools[])
- `POST /ai/index` (file_id)
- `POST /deploy` (project_id)

---

## Data Model (MVP)

See [`project.txt`](project.txt) for full schema.

- **users**(id, email, name, avatar_url, created_at)
- **files**(id, user_id, parent_id, name, kind[file|folder], size, mime, version, blob_key, checksum, shared, created_at, updated_at)
- **projects**, **sandboxes**, **embeddings**, **deployments**, etc.

---

## Development Notes

- **Testing**: Unit tests (Vitest/Jest), integration tests (docker-compose), smoke tests.
- **Observability**: Tracing (OpenTelemetry), metrics (Prometheus), logging (JSON).
- **Security**: JWT, signed URLs, container isolation, resource quotas.

---

## Demo Story

1. Log in → desktop loads with smooth windowing.
2. Open **Files** → drag a Next.js template; open **Editor** → AI explains and refactors a component.
3. Click **Run in Terminal** → tests execute in the sandbox container; AI suggests a fix and edits file.
4. **Share** a file link; viewer sees live changes.
5. Click **Deploy** → app gets a public URL.
6. Open **Copilot** → “Create a new Notes app from spec” → scaffolds files, installs dependencies, opens a PR in embedded Git.

---

## License

MIT