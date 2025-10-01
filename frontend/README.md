# Keeper

A fast, minimal note-taking web app built with **React (Vite)** on the frontend and **Node.js + Express + MongoDB** on the backend. Create, search, pin, and organize notes—designed to be simple, responsive, and deployment-friendly.

[**Live**](https://keeper-shwetank.vercel.app) • [**Repository**](https://github.com/Shwetank00/Keeper)

---

## ✨ Features

- ⚡️ **Instant UX** with Vite + React and client-side routing
- 🔐 **Auth** (login, signup, logout) and **password reset via OTP**
- 📝 **CRUD for notes** (create, read, update, delete)
- 📌 **Pin / archive** and basic organization
- 🔎 **Search** notes by title/content
- 🌓 **Responsive UI** that works on mobile and desktop
- 🛡️ **API error handling** with consistent JSON responses

> Tip: If you’re deploying only the frontend to Vercel, set `VITE_API_URL` to your backend’s URL.

---

## 🧱 Tech Stack

**Frontend:** React, Vite, React Router
**Backend:** Node.js, Express
**Database:** MongoDB (Atlas or self-hosted)
**Auth:** JWT (with HTTP-only cookies or Authorization headers)
**Deploy:** Vercel (FE), any Node host (BE)

---

## 📦 Monorepo Structure

```
keeper/
├─ frontend/        # React + Vite app
│  ├─ src/
│  └─ index.html
└─ backend/         # Express API
   └─ src/
```

---

## 🚀 Quick Start

### 1) Prerequisites

- Node.js ≥ 18
- MongoDB connection string (Atlas or local)

### 2) Clone

```bash
git clone https://github.com/Shwetank00/Keeper.git
cd Keeper
```

### 3) Environment variables

Create **`backend/.env`** (or `.env.local`) from this template:

```env
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_long_random_secret
PORT=5000
CORS_ORIGIN=http://localhost:5173,https://keeper-shwetank.vercel.app
```

Create **`frontend/.env`**:

```env
VITE_API_URL=http://localhost:5000
```

### 4) Install & run (dev)

**Backend**

```bash
cd backend
npm install
npm run dev
# server at http://localhost:5000
```

**Frontend**

```bash
cd ../frontend
npm install
npm run dev
# app at http://localhost:5173
```

---

## 🔌 API Overview (brief)

Base URL: `http://localhost:5000`

- `POST /auth/signup` – create account
- `POST /auth/login` – login, returns token/cookie
- `POST /auth/forgot` – start OTP flow
- `POST /auth/verify-otp` – verify OTP for reset
- `POST /auth/reset` – set new password
- `GET /notes` – list notes (supports `?search=&page=&limit=`)
- `POST /notes` – create note
- `PATCH /notes/:id` – update note (pin/archive supported)
- `DELETE /notes/:id` – delete note

> Responses follow `{ ok: boolean, ...data }` with proper HTTP codes.

---

## 🧪 Scripts

**Frontend**

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "format": "prettier --write \"**/*.{js,jsx,json,md,css}\""
  }
}
```

**Backend**

```json
{
  "scripts": {
    "dev": "nodemon src/index.js",
    "start": "node src/index.js",
    "format": "prettier --write \"**/*.{js,json,md}\""
  }
}
```

---

## 🛳️ Deploy

### Frontend (Vercel)

- Framework: **Vite**
- Build command: `npm run build`
- Output dir: `dist`
- Env: `VITE_API_URL=https://your-backend.example.com`

### Backend

- Any Node host (Render, Railway, Fly, VPS).
- Ensure envs from **backend/.env** are set.
- If CORS is enabled, include both your local and Vercel origins.

---

## 🧰 Developer Notes

- **Axios base URL** should read from `import.meta.env.VITE_API_URL`.
- Render the **Navbar** once at layout level to avoid duplicate mounts.
- Normalize line endings on Windows with a `.gitattributes`:

  ```
  * text=auto eol=lf
  ```

---

## 🗺️ Roadmap

- [ ] Rich text / Markdown
- [ ] Labels & filters
- [ ] Drag-to-pin, keyboard shortcuts
- [ ] Offline cache (IndexedDB)
- [ ] E2E tests (Playwright)

---

## 🤝 Contributing

1. Fork and create a feature branch
2. `npm run format` before committing
3. Commit style: `feat|fix|chore|docs|refactor|test: message`
4. Open a PR

---

## 🐛 Troubleshooting

- **Green graph not updating?**
  Verify your Git author email matches your GitHub verified email and commits are on the default branch (`main`).

- **Frontend can’t reach API**
  Check `VITE_API_URL`, CORS `CORS_ORIGIN`, and that backend is reachable.

---

## 📜 License

MIT © Shwetank Jain

---

## 👤 Author

**Shwetank Jain**

- Email: `shwetankjain00@gmail.com`
- GitHub: [https://github.com/Shwetank00](https://github.com/Shwetank00)
