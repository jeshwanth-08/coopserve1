# CoopServe • Cooperative Gig & Household Services Platform

> A neighborhood-first, community-driven gig services and dispatch platform connecting households with verified, licensed local specialists through transparent cooperative governance.

---

## 🌟 Overview

**CoopServe** eliminates exploitative commission markups and opaque contractor assignment in traditional on-demand service platforms. It provides guaranteed upfront pricing, emergency priority dispatch, community-level cosigning for public infrastructure issues, and strict role-based access control across three user classes: **Members**, **Service Providers**, and **Admin Coordinators**.

---

## 👥 The 3-Role Access & Permissions Schema

CoopServe strictly gates capabilities, routes, and data access based on authenticated user roles:

```
                  ┌─────────────────────────────────┐
                  │       CoopServe Platform        │
                  └────────────────┬────────────────┘
         ┌─────────────────────────┼─────────────────────────┐
         ▼                         ▼                         ▼
┌──────────────────┐      ┌──────────────────┐      ┌──────────────────┐
│  Service Member  │      │ Service Provider │      │ Admin Coordinator│
├──────────────────┤      ├──────────────────┤      ├──────────────────┤
│• Create Request  │      │• View Assigned   │      │• View All Reqs   │
│• View My Requests│      │• Accept Request  │      │• Assign Provider │
│• Track Status    │      │• Update Progress │      │• Update Status   │
│• Rate Service    │      │• Mark Resolved   │      │• Manage Providers│
│                  │      │• View Ratings    │      │• Dashboard Stats │
└──────────────────┘      └──────────────────┘      └──────────────────┘
```

### 1. 🧑‍🔧 Service Provider Access
Specialists and technicians on duty enjoy dedicated job management:
* **View Assigned Requests** (`/provider/requests`): List of all tasks dispatched to the logged-in provider, scoped strictly by `assignedProviderId`. Includes filters by state (`ASSIGNED`, `ACCEPTED`, `ON_THE_WAY`, `IN_PROGRESS`, `RESOLVED`).
* **Accept Request**: 1-click acceptance via `POST /api/requests/[id]/respond` moving the status from `ASSIGNED` to `ACCEPTED`, or declining with structured audit reasons.
* **Update Progress**: Granular status advancement:
  - From `ACCEPTED` ➔ **Update Progress: On The Way** (records provider travel & ETA).
  - From `ON_THE_WAY` ➔ **Update Progress: Start Work (In Progress)**.
* **Mark Resolved**: Conclude service tasks with completion notes, replacement part details, and photo verification.
* **View Ratings** (`/provider/ratings`): Scorecard displaying average rating (e.g. ★ 4.9), star breakdown distribution (1 to 5 stars), and verified neighborhood reviews.

---

### 2. 🏛️ Admin Coordinator Access
Central dispatch operators and cooperative administrators:
* **View All Requests** (`/admin/requests`): Central monitoring board showing all service orders across all localities, categories, urgencies, and statuses.
* **Assign Service Provider**: Interactive dispatch modal (`AssignProviderModal`) matching unassigned requests with available verified specialists based on locality, rating, and workload.
* **Update Status**: Coordinator administrative override to transition request statuses during disputes, escalations, or emergency interventions.
* **Manage Providers** (`/admin/providers`): Provider roster controls to verify credentials, licenses, certifications, and toggle active duty availability.
* **Dashboard Analytics** (`/admin`): Real-time metrics tracking platform resolution rates, dispatch response times, active jobs, GMV revenue, and locality performance.

---

### 3. 🏠 Member Access
Households, homeowners, and community residents:
* **Create Service Request** (`/member/requests/new`): Service creation wizard supporting category selection, emergency priority dispatch flag, preferred time slots, address, and personal vs community visibility.
* **View My Requests** (`/member/requests`): Comprehensive feed of all service requests submitted by the logged-in member.
* **Track Status** (`/member/requests/[id]`): Interactive timeline tracking live execution through 5 lifecycle stages:
  $$\text{PENDING} \longrightarrow \text{ASSIGNED} \longrightarrow \text{ON THE WAY} \longrightarrow \text{IN PROGRESS} \longrightarrow \text{RESOLVED}$$
  Features assigned provider details, direct call, and ETA.
* **Rate Service**: When a request is marked `RESOLVED`, members submit 1–5 star ratings, feedback tags (*Punctual*, *Professional*, *Clean Work*), and detailed testimonials (`ReviewModal`).

---

## ⚡ 1-Click Demo Accounts

The application includes seeded accounts with pre-populated service requests and performance records. You can switch personas instantly using the **1-Click Demo** dropdown in the navigation header:

| Role | Name | Email | Default Password | Access Portal |
| :--- | :--- | :--- | :--- | :--- |
| **Admin Coordinator** | Eleanor Vance | `admin@coop.org` | `admin123` | [`/admin`](http://localhost:3000/admin) |
| **Service Provider** | Marcus Thorne (Electrician) | `provider1@coop.org` | `password123` | [`/provider`](http://localhost:3000/provider) |
| **Service Provider** | David Chen (Plumber) | `provider2@coop.org` | `password123` | [`/provider`](http://localhost:3000/provider) |
| **Community Member** | Alice Henderson | `member1@coop.org` | `password123` | [`/member`](http://localhost:3000/member) |
| **Community Member** | Elena Rostova | `member5@coop.org` | `password123` | [`/member`](http://localhost:3000/member) |
| **Public Guest** | — (Unauthenticated) | — | — | [`/`](http://localhost:3000/) |

---

## 🛠️ Tech Stack & Architecture

* **Framework**: [Next.js 14](https://nextjs.org/) (App Router, Server Components & Route Handlers)
* **Language**: [TypeScript](https://www.typescriptlang.org/) with strict type checking
* **Styling**: [Tailwind CSS](https://tailwindcss.com/) with Lucide React icons
* **Database & ORM**: [Prisma ORM](https://www.prisma.io/) with SQLite (local) / PostgreSQL (production)
* **Authentication**: Stateless JSON Web Tokens (JWT) signed with `jose`, stored in HTTP-only cookies (`coop_session`)
* **State Machine**: Deterministic transition validation enforcing role permissions in `src/lib/transitions.ts`

---

## 🚀 Getting Started Locally

### 1. Prerequisites
* Node.js 18.17.0+ or 20.x
* npm 9.x or later

### 2. Installation
```bash
git clone https://github.com/jeshwanth-08/coopserve1.git
cd coopserve1
npm install
```

### 3. Environment Configuration
Create a `.env` file in the root directory:
```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="cooperative-gig-services-platform-secret-key-2026-secure"
```

### 4. Database Setup & Seeding
Push the schema to your SQLite database and seed initial demonstration records:
```bash
npx prisma db push
npx prisma db seed
```

### 5. Launch Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🌐 Deploying to Vercel

### Option A: Via Vercel Web Dashboard (Recommended)
1. Push your changes to GitHub on a clean branch (e.g. `main` or `feature/coopserve-v2`).
2. Go to [vercel.com/new](https://vercel.com/new) and import the `coopserve1` repository.
3. Configure Environment Variables in the project settings:
   - `JWT_SECRET`: `cooperative-gig-services-platform-secret-key-2026-secure`
   - `DATABASE_URL`: Your PostgreSQL / Supabase connection string, or a hosted database URI.
4. Click **Deploy**. Vercel will automatically build and deploy the Next.js application.

### Option B: Via Vercel CLI
```bash
# 1. Authenticate with Vercel
vercel login

# 2. Link and deploy
vercel

# 3. Deploy to production
vercel --prod
```

---

## 📂 Project Structure

```
coopserve1/
├── prisma/
│   ├── schema.prisma              # Database schema definition
│   └── seed.ts                    # Realistic demo seed data generator
├── src/
│   ├── app/
│   │   ├── (auth)/                # Multi-channel login & registration
│   │   ├── (dashboard)/
│   │   │   ├── admin/             # Central dispatch & coordinator controls
│   │   │   ├── provider/          # Specialist workspace & job management
│   │   │   └── member/            # Household request tracking & reviews
│   │   ├── api/                   # REST route handlers & auth endpoints
│   │   │   ├── auth/              # JWT session management & 1-click switch
│   │   │   ├── requests/          # Request lifecycle & status transitions
│   │   │   └── providers/         # Specialist verification & rosters
│   │   ├── page.tsx               # Public marketplace home (role-aware)
│   │   └── layout.tsx             # Root layout with mobile navigation
│   ├── components/
│   │   ├── home/                  # Marketplace UI, navbar, hero, cards
│   │   ├── AssignProviderModal.tsx# Coordinator dispatch assignment modal
│   │   ├── ReviewModal.tsx        # Post-service member rating component
│   │   ├── Sidebar.tsx            # Role-scoped dashboard navigation
│   │   └── StatusTimeline.tsx     # 5-stage live dispatch stepper
│   ├── lib/
│   │   ├── auth.ts                # JWT cookie verification & helpers
│   │   ├── constants.ts           # Status & role enum definitions
│   │   ├── prisma.ts              # Global Prisma client instance
│   │   └── transitions.ts         # Server-enforced status transition machine
│   └── middleware.ts              # Route protection & role redirection
└── package.json
```

---

## 📄 License
This project is licensed under the MIT License.
