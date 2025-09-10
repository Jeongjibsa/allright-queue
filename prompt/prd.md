# Product Requirements Document (PRD)

This document defines the current scope and target architecture for the Allright Orthopedics Queue & Reservation System. It serves as a reference for consistent, forward-looking development.

## 1. Overview

- Goals: Improve patient experience (real-time queue, simple reservations) and staff efficiency (admin dashboard, master data management).
- Users: Patients (new/returning) and hospital staff (front desk/admin).

## 2. Tech Stack & Architecture

- Frontend: Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS 4, shadcn/ui (Radix)
- State: TanStack React Query (polling/cache), React Hooks
- Server/API: Next.js Route Handlers (`src/app/api/queue/route.ts`)
- Infrastructure (target): Docker Compose — `web` (Next.js), `redis` (queue/reservations), `db` (RDB for history/CRUD)
- Storage
  - Current: In-memory Map + some `localStorage` (demo)
  - Target: Redis for real-time queue/reservations; PostgreSQL for history, master data, and accounts

## 3. Project Structure (Summary)

```
src/
  app/                  # Routes/layouts, API
    page.tsx            # Home
    register/page.tsx   # Patient registration
    queue/page.tsx      # Queue status (by token)
    reservation/page.tsx# Reservation for returning patients
    admin/              # Admin section
      page.tsx          # Dashboard (30s polling)
      services/page.tsx # Services master (localStorage for now)
      doctors/page.tsx  # Doctors master (localStorage for now)
      patients/page.tsx # Patients master (localStorage for now)
      settings/page.tsx # System settings (UI only)
    api/queue/route.ts  # Queue API (GET/POST/PUT/DELETE/PATCH)
  components/ui/        # Shared UI components
  lib/                  # Hooks/utils (useQueue, useReservation)
```

## 4. Key Functional Requirements

### 4.1 Registration (`/register`)

- Input: name, age, service (required); optional room, doctor (auto-fill room on doctor select)
- Process: POST `/api/queue` → issue token, return queue URL (`/queue?token=...`)
- Output: ticket/token, estimated wait time, copy/open link actions
- Options: services/doctors from Admin (via localStorage for now)

Acceptance criteria

- Validate required fields; reset form on success and show link
- Default wait times per service: general 10 / revisit 5 / test 15 / prescription 3 (configurable)

### 4.2 Queue (`/queue?token=...`)

- View: name/age/room/doctor, remaining minutes (ETA), progress, “Info” tab, “Notify” tab (UI)
- Refresh: React Query polling every 3 minutes; manual refresh button; show “last updated”

Acceptance criteria

- Handle missing/invalid token; ETA <= 0 → “about to be called”
- Show warning within 5 minutes
- Token is an opaque, high-entropy server-generated value (e.g., `Q-<base36>-<rand>`).

### 4.3 Reservation (`/reservation`)

- Input: name, patientId, phone, service, date (calendar)
- Visit check: temporary rule — patientId starting with `P` means returning patient
- Storage (current): write to `localStorage`

Acceptance criteria

- Disallow reservation before visit check; validate all fields; show reservation number/summary on success
- Reservation token/ID is server-generated, collision-resistant

### 4.4 Admin Dashboard (`/admin`)

- List: PATCH `/api/queue?action=list`, 30s polling
- Actions: edit fields, delete, complete immediately (ETA = 0), statistics (total/urgent/completed)

Acceptance criteria

- Reflect edits immediately; confirm before delete/complete
- Admin authentication required (session/JWT); block non-admin access

### 4.5 Masters/Settings

- Services (`/admin/services`): code/label/wait time, enable/disable, CRUD → localStorage (for now)
- Doctors (`/admin/doctors`): name/specialty/room (+contact), enable/disable, CRUD → localStorage
- Patients (`/admin/patients`): name/age/phone/notes, enable/disable, CRUD → localStorage
- Settings (`/admin/settings`): form UI (auto refresh, notification toggles) — display only

## 5. API Design (Current)

- Base: `/api/queue`
- GET `?token=...` → return QueueData (with ETA)
- POST `{ name, age, service, room?, doctor? }` → return token, queueUrl, estimatedWaitTime
- PUT `{ token, ...fields }` → update entry (admin)
- DELETE `?token=...` → delete entry
- PATCH `?action=list` → return sorted queue list + elapsed/remaining fields

QueueData
`{ token, name, age, service, room?, doctor?, estimatedWaitTime, createdAt, updatedAt }`

Auth/Authorization (Target)

- Patient views/reservations: token-based (in URL or `Authorization: Bearer <token>`)
- Admin views/API: account login (email/password → session cookie or JWT), `role=admin` required
- CORS: if API server is split, restrict to allowed origins (e.g., `NEXT_PUBLIC_APP_URL`); define credentials policy

## 6. Data Model

Current (demo)

- QueueData: in-memory Map
- ReservationData: `localStorage.reservations`
- Masters/patients: `localStorage.services`, `localStorage.doctors`, `localStorage.patients`

Target

- Redis (real-time)
  - Keys (examples)
    - `queue:token:<token>` → Hash {name, age, service, room, doctor, createdAt, estWait}
    - `queue:pending` → ZSET (score=createdAt, member=`<token>`) — listing/sort
    - `queue:completed` → ZSET (score=completedAt, member=`<token>`) — short-term archive
    - `reservation:id:<id>` → Hash {..., date}
    - `reservation:byDate:<yyyy-mm-dd>` → SET (member=`<id>`) — date index
  - TTL: apply TTL to completed/expired items (e.g., 24h)
- RDB (persistent)
  - Tables: `patients`, `doctors`, `services`, `users`, `queues_history`, `reservations`

## 7. Non-Functional Requirements

- Performance: 3m polling for patient view; 30s for admin; avoid unnecessary re-renders
- Accessibility: reduced motion support, clear status text/badges, keyboard navigation
- Security/Auth: admin login required, password hashing (bcrypt), least privilege; high-entropy patient tokens with scope/expiry; TLS in production; audit logging
- CORS: whitelist allowed origins when API is split; review credentials policy for sensitive endpoints

## 8. Next Steps (Priorities)

1. Introduce Redis: migrate in-memory/localStorage → Redis (keys, TTL, listing queries)
2. Introduce RDB: finalize schema for masters/patients/history/accounts and add migrations
3. AuthZ: admin login flow (session/JWT) + token verification middleware for patient endpoints
4. Split API server and configure CORS; manage env/secrets
5. Enhance reservation logic (history checks/dedup/time slots); SMS/Kakao integration
6. Persist settings (UI ↔ server), refine deployment pipeline

## 9. Deployment/Operations (Compose Outline)

Required env vars (example)

```
REDIS_URL=redis://redis:6379
DATABASE_URL=postgresql://app:app@db:5432/allright
NEXT_PUBLIC_APP_URL=http://localhost:3000
JWT_SECRET=change-me
```

Services (high level)

- `web`: Next.js app (port 3000)
- `redis`: Redis 7+ (port 6379)
- `db`: PostgreSQL 15+ (port 5432)

Ops checklist

- Health checks (web/Redis/DB), logs, backups (snapshots/dumps), monitoring (ETA lag/queue length)
