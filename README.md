# Exerun

<h3 align="center">Live Collaborative Code Editor & Runner</h3>

<p align="center">
  <strong>Edit together. Run anywhere.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/TypeScript-89.1%25-3178C6?style=flat&logo=typescript"/>
  <img src="https://img.shields.io/badge/license-MIT-blue"/>
  <img src="https://img.shields.io/badge/powered%20by-Liveblocks-FF6B6B"/>
</p>

**Exerun** is a real-time collaborative code editor with cursor presence, shared code editing, and remote code execution — all inside your browser. Powered by **Liveblocks** for multiplayer sync and **OneCompiler** for running code in 40+ languages.

> 🌐 **Live demo:** [exerun.princecodes.tech](https://exerun.princecodes.tech)

---

## Features

- **Real-time code editing** — Multiple users edit the same file simultaneously via Liveblocks
- **Live cursors** — See exactly where others are typing with colored cursor overlays
- **40+ languages** — JavaScript, Python, Java, C++, Go, Rust, and more
- **Remote execution** — Run code on OneCompiler's engine and see stdout/stderr/errors instantly
- **Rooms** — Create or join rooms with a shareable 12-character ID
- **Undo / Redo** — Full undo/redo support synced across the room
- **Participants panel** — See who's in the room with their assigned color
- **Auto-cleanup** — Rooms are automatically deleted when the last person leaves

---

## Architecture

```
┌─────────────────────────────────────────────────┐
│                  Frontend (Vite + React)         │
│                                                   │
│  ┌──────────┐   ┌──────────────┐   ┌─────────┐ │
│  │Monaco    │   │Liveblocks    │   │Output   │ │
│  │Editor    │◄──│Storage +     │──►│Panel    │ │
│  │          │   │Presence      │   │         │ │
│  └──────────┘   └──────┬───────┘   └─────────┘ │
│                        │ WebSocket               │
├────────────────────────┼─────────────────────────┤
│                  Backend (Express)               │
│                        │                         │
│  ┌──────────┐   ┌──────┴───────┐   ┌─────────┐ │
│  │Liveblocks│   │  Auth + Room │   │Code     │ │
│  │Webhooks  │◄──│  Management  │──►│Execution│ │
│  │          │   │              │   │Proxy    │ │
│  └──────────┘   └──────────────┘   └────┬────┘ │
│                                         │       │
└─────────────────────────────────────────┼───────┘
                                          │
                               ┌──────────▼───────┐
                               │  OneCompiler API  │
                               │  (via RapidAPI)   │
                               └──────────────────┘
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Editor** | Monaco Editor (`@monaco-editor/react`) |
| **Real-time** | Liveblocks (Storage, Presence, Webhooks) |
| **Code Execution** | OneCompiler API via RapidAPI |
| **Frontend** | React 19, TypeScript, Vite 7 |
| **Styling** | Tailwind CSS v4, shadcn/ui, Radix UI |
| **State** | Redux Toolkit |
| **Routing** | React Router v7 |
| **Backend** | Express 5, TypeScript |
| **Deployment** | Vercel (frontend + serverless backend) |

---

## Getting Started

### Prerequisites

- Node.js >= 18
- npm

### 1. Clone

```bash
git clone https://github.com/prncexe/exerun.git
cd exerun
```

### 2. Backend Setup

```bash
cd backend
cp .env.example .env
npm install
```

Fill in `.env` with your credentials:

| Variable | Description |
|---|---|
| `LIVEBLOCKS` | Liveblocks secret key (`sk_*`) |
| `onecompiler_api_key` | RapidAPI key for OneCompiler |
| `onecompiler_url` | OneCompiler API endpoint |
| `onecompiler_host` | OneCompiler API host |
| `cors_url` | Frontend URL (e.g. `http://localhost:5173`) |

```bash
npm run dev
```

Server starts at `http://localhost:3000`.

### 3. Frontend Setup

```bash
cd frontend
cp .env.example .env
npm install
```

Fill in `.env`:

| Variable | Description |
|---|---|
| `VITE_LIVEBLOCKS_PUBLIC_KEY` | Liveblocks public key (`pk_*`) |
| `VITE_server_url` | Backend URL (e.g. `http://localhost:3000`) |

```bash
npm run dev
```

App starts at `http://localhost:5173`.

---

## Project Structure

```
exerun/
├── backend/
│   └── src/
│       └── index.ts          # Express server (auth, rooms, code execution)
├── frontend/
│   ├── public/               # Favicons, manifest
│   └── src/
│       ├── components/ui/    # shadcn/ui + custom components
│       ├── constants/        # Language-to-filename mapping
│       ├── features/         # Redux slices
│       ├── hooks/            # Code runner, clipboard
│       ├── store/            # Redux store
│       ├── types/            # Shared TypeScript types
│       ├── App.tsx           # Router setup (/ and /collaborative/:id)
│       ├── RoomProvider.tsx  # Create/join room screen
│       ├── CollaborativeEditor.tsx  # Liveblocks wrapper
│       ├── liveblocks.config.ts     # Presence, Storage, Events types
│       └── main.tsx          # Entry point
├── LICENSE                   # MIT
└── README.md
```

---

## API Endpoints

| Method | Route | Purpose |
|---|---|---|
| `GET` | `/` | Health check |
| `POST` | `/auth` | Liveblocks authentication |
| `GET` | `/checkroom` | Check if a room exists |
| `GET` | `/prewarm/:id` | Create/prewarm a Liveblocks room |
| `POST` | `/roomEmpty` | Handle user join/leave events |
| `POST` | `/runcode` | Execute code via OneCompiler |

---

## Deployment

Both frontend and backend deploy to **Vercel**.

- **Frontend:** `frontend/` — includes `vercel.json` for SPA fallback routing
- **Backend:** `backend/` — Express app is exported as a serverless function

---

## License

MIT — Copyright 2025 [Prince Yadav](https://github.com/prncexe)

---

## Acknowledgements

- [Liveblocks](https://liveblocks.io) for real-time infrastructure
- [OneCompiler](https://onecompiler.com) via [RapidAPI](https://rapidapi.com)
- [Monaco Editor](https://microsoft.github.io/monaco-editor)
- [shadcn/ui](https://ui.shadcn.com) component primitives
