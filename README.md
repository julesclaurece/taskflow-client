# TaskFlow — Task Management App

> TaskFlow helps anyone managing multiple projects stay on top of their work — no more scattered notes or missed deadlines, just a clear visual board showing exactly what needs to happen next.

**Live Demo:** `https://taskflow-client.vercel.app`  
**API:** `https://taskflow-api.up.railway.app`

---

## The Problem

Freelancers, entrepreneurs, students, team leads — everyone juggles tasks across multiple projects. They end up with to-do lists on sticky notes, phone notes, spreadsheets, and emails. Things fall through the cracks, deadlines are missed, and nobody knows what's actually in progress.

TaskFlow fixes that by putting everything in one place: every task has a priority, a deadline, a status, and belongs to a project. The Kanban board gives you an instant picture of what's blocked, what's moving, and what's done — no meeting required.

---

## Features

- **Kanban board** — drag between To Do / In Progress / Done columns
- **List view** — filterable, paginated task list
- **Projects** — group tasks, track progress per project with visual completion bars
- **Filters** — by status, priority, project, keyword, due date
- **JWT Auth** — register, login, token refresh
- **Demo account** — try the app instantly without registering

## Tech Stack

| Layer | Tech |
|---|---|
| Frontend | React 19 + TypeScript + Vite |
| Styling | Tailwind CSS v4 |
| State | Zustand |
| Forms | React Hook Form |
| HTTP | Axios (with JWT interceptor + auto-refresh) |
| Backend | Django 6 + Django REST Framework |
| Auth | JWT via `djangorestframework-simplejwt` |
| Database | PostgreSQL (Neon) |
| Deployment | Vercel (frontend) · Railway (API) |

---

## Quick Start

```bash
git clone https://github.com/yourusername/taskflow-client
cd taskflow-client

npm install

cp .env.example .env
# Set VITE_API_URL=http://localhost:8001

npm run dev
```

Open `http://localhost:5173` — click **"Try the demo"** on the login page to explore with pre-loaded data.

### Environment Variables

| Variable | Description |
|---|---|
| `VITE_API_URL` | Backend API URL |

---

## Demo Account

| Username | Password |
|---|---|
| `demo` | `demo1234` |

Pre-loaded with 3 projects and 20 realistic tasks across all statuses and priorities.

---

## Backend

The API is a separate repo: [taskflow-api](https://github.com/yourusername/taskflow-api)

Built with Django REST Framework — full CRUD, JWT auth, pagination, filters, and Swagger docs at `/api/docs/`.
