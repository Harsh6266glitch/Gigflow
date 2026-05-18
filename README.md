# ⚡ GigFlow – Smart Leads Dashboard

GigFlow is a modern, enterprise-grade CRM platform built for the Full Stack Development Internship technical assessment. It provides an intelligent leads dashboard with role-based access control, advanced filtering, robust authentication, and a stunning SaaS-style UI.

---

## 🌟 Features

- **🔐 Secure Authentication:** JWT-based auth with HttpOnly cookies/Bearer tokens, password hashing, and persistent login.
- **👥 Role-Based Access Control (RBAC):** `Admin` (full CRUD + CSV export) and `Sales User` (create/view/update only).
- **📋 Lead Management:** Complete CRUD operations for leads (Name, Email, Status, Source).
- **🔍 Advanced Filtering & Search:**
  - Debounced frontend search.
  - Server-side filtering by status, source, and search terms simultaneously.
  - Server-side pagination.
  - Server-side sorting (latest/oldest).
- **📊 KPI Dashboard:** Real-time analytics, status/source breakdowns, and trend indicators.
- **📥 CSV Export:** Admin-only feature to export filtered leads to a CSV file.
- **🌗 Dark Mode:** Full dark mode support with system preference detection and smooth transitions.
- **✨ Professional UI/UX:** Built with TailwindCSS, Lucide icons, Skeleton loaders, and toast notifications.

---

## 🛠️ Tech Stack

### Frontend (Vite + React)
- **Framework:** React.js + TypeScript
- **Routing:** React Router v6
- **State Management:** Zustand (for Auth & Filters)
- **Data Fetching:** TanStack Query (React Query) + Axios
- **Styling:** TailwindCSS + clsx + tailwind-merge
- **Forms & Validation:** React Hook Form + Zod

### Backend (Node.js)
- **Framework:** Express.js + TypeScript
- **Database:** MongoDB + Mongoose
- **Authentication:** JSON Web Tokens (JWT) + bcryptjs
- **Validation:** Zod
- **Security:** Helmet, CORS

### DevOps & Containerization
- **Docker:** Multi-stage Dockerfiles for Frontend and Backend.
- **Orchestration:** Docker Compose for local full-stack execution.
- **Web Server:** NGINX (serving the frontend container).

---

## 📁 Project Structure

```text
gigflow/
├── backend/
│   ├── src/
│   │   ├── config/          # DB config
│   │   ├── controllers/     # Route controllers
│   │   ├── interfaces/      # Type augmentations
│   │   ├── middleware/      # Auth, Role, Error, Validation middlewares
│   │   ├── models/          # Mongoose schemas
│   │   ├── routes/          # Express routes
│   │   ├── utils/           # Seeders and helpers
│   │   ├── validators/      # Zod validation schemas
│   │   ├── app.ts           # Express app setup
│   │   └── server.ts        # Entry point
│   ├── Dockerfile
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── api/             # Axios instances and API services
│   │   ├── components/      # Reusable UI (Buttons, Modals, Forms, Table)
│   │   ├── hooks/           # TanStack queries and custom hooks
│   │   ├── layouts/         # Dashboard layout (Sidebar, Navbar)
│   │   ├── pages/           # Login, Register, Dashboard, Leads pages
│   │   ├── routes/          # Route guards
│   │   ├── store/           # Zustand stores
│   │   ├── types/           # TypeScript interfaces
│   │   ├── App.tsx          # Router setup
│   │   └── main.tsx         # React entry
│   ├── Dockerfile
│   ├── nginx.conf
│   └── tailwind.config.js
│
└── docker-compose.yml       # Full stack container setup
```

---

## 🚀 Getting Started (Docker)

The easiest way to run the entire application is using Docker Compose. This spins up the MongoDB database, the Node.js backend, and the NGINX frontend.

1. **Clone the repository.**
2. **Start the containers:**
   ```bash
   docker-compose up --build
   ```
3. **Access the application:**
   - Frontend: [http://localhost](http://localhost)
   - Backend API: [http://localhost:5000/api](http://localhost:5000/api)

4. **Seed the Database:**
   To populate the database with demo users and leads, open a new terminal and run:
   ```bash
   docker exec -it gigflow-backend npm run seed
   ```

### 🔑 Demo Credentials (after seeding)
- **Admin:** `admin@gigflow.com` / `Admin@123`
- **Sales User:** `sarah@gigflow.com` / `Sales@123`

---

## 💻 Local Development Setup (Without Docker)

### Prerequisites
- Node.js (v18+)
- MongoDB (running locally or MongoDB Atlas URL)

### Backend Setup
1. `cd backend`
2. `npm install`
3. Rename `.env.example` to `.env` and configure your `MONGODB_URI`.
4. `npm run seed` (Optional, to populate data)
5. `npm run dev`

### Frontend Setup
1. `cd frontend`
2. `npm install`
3. Rename `.env.example` to `.env` and verify `VITE_API_URL` points to your backend.
4. `npm run dev`
5. Open [http://localhost:5173](http://localhost:5173)

---

## 📚 API Documentation

### Authentication (`/api/auth`)
| Method | Endpoint | Description | Auth Required | Payload |
|--------|----------|-------------|---------------|---------|
| POST | `/register` | Register a new user | No | `{ name, email, password, role? }` |
| POST | `/login` | Authenticate user | No | `{ email, password }` |
| GET | `/me` | Get current user | Yes | None |
| POST | `/logout` | Clear auth token | Yes | None |

### Leads (`/api/leads`)
| Method | Endpoint | Description | Auth Required | Query Params |
|--------|----------|-------------|---------------|--------------|
| GET | `/` | Get paginated leads | Yes | `page`, `limit`, `status`, `source`, `search`, `sort` |
| POST | `/` | Create a lead | Yes | `{ name, email, status, source, notes? }` |
| GET | `/:id` | Get single lead | Yes | None |
| PUT | `/:id` | Update a lead | Yes | `{ name, email, status, source, notes? }` |
| DELETE | `/:id` | Delete a lead | Yes (Admin) | None |
| GET | `/stats` | Get KPI metrics | Yes | None |
| GET | `/export/csv` | Export leads | Yes (Admin) | `status`, `source`, `search` |

---

## ☁️ Deployment Guide

### Database (MongoDB Atlas)
1. Create a cluster on MongoDB Atlas.
2. Get the connection string.

### Backend (Render / Railway)
1. Connect your repository.
2. Set Build Command: `npm install && npm run build`
3. Set Start Command: `npm start`
4. Add Environment Variables: `MONGODB_URI`, `JWT_SECRET`, `CLIENT_URL`.

### Frontend (Vercel)
1. Import the `frontend` directory to Vercel.
2. Build Command: `npm run build`
3. Output Directory: `dist`
4. Add Environment Variable: `VITE_API_URL` (pointing to your deployed backend).

---

Built with ❤️ for the Full Stack Development Internship assessment.
