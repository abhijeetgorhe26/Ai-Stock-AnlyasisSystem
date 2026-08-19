# AI Stock Analysis System - Complete Architecture & Codebase Documentation

This document provides a comprehensive, single-source reference of the system architecture, directory structure, authentication flow, Yahoo Finance market data integration, environment security, and team workflow guidelines.

---

## 🏛️ 1. High-Level System Architecture

The **AI Stock Analysis System** is structured as a decoupled, production-ready micro-architecture combining Web, API, Database, and AI services:

```
                                  +---------------------------------------+
                                  |     Next.js 16 Frontend (React 19)    |
                                  |   (Groww-Inspired UI + Tailwind CSS)  |
                                  +-------------------+-------------------+
                                                      |
                                       HTTP Requests & Cookies (JWT)
                                                      |
                                                      ▼
                                  +---------------------------------------+
                                  |     Node.js + Express + TypeScript    |
                                  |       Backend Gateway (Port 5001)     |
                                  +---------+-------------------+---------+
                                            |                   |
                     ┌──────────────────────┴──────┐     ┌──────┴──────────────────────┐
                     ▼                             ▼     ▼                             ▼
        +─────────────────────────+    +───────────────────────+   +─────────────────────────+
        |   PostgreSQL Database   |    | Yahoo Finance API     |   | Python FastAPI AI Layer |
        | (Neon / Local DB: 5432) |    | (Live Market & Quotes)|   |  (PyTorch / ML Models)  |
        +─────────────────────────+    +───────────────────────+   +─────────────────────────+
```

---

## 📁 2. Frontend Architecture & Folder Structure (`frontend/src/`)

The frontend follows a clean, modular architecture (excluding `server/` per project specification):

```
frontend/src/
├── auth/
│   └── jwt.ts            # JWT token decoder, claim categorizer & timestamp parser
├── components/
│   ├── AuthLayout.tsx    # Split-screen hero & form card container (Reference UI)
│   ├── Navbar.tsx        # Groww-style top navbar (Stocks, F&O, Mutual Funds, Search, Sub-nav)
│   ├── MarketTicker.tsx  # Live market index banner (NIFTY, SENSEX, BANKNIFTY, etc.)
│   ├── MostTradedStocks.tsx # Groww Most Traded Stock cards grid with live quotes
│   ├── TopMovers.tsx     # Filterable top movers list (Gainers, Losers, Volume) + SVG sparklines
│   ├── InvestmentsCard.tsx  # Virtual portfolio & paper trading summary card
│   ├── ProductsTools.tsx    # Products & tools list (IPO, Bonds, ETFs, AI Screener)
│   ├── PayloadTable.tsx  # Formatted JWT Payload Claims table & raw JSON copy tool
│   └── LogoutButton.tsx  # Client-side session logout handler
├── contexts/
│   └── AuthContext.tsx   # React AuthContext provider managing session & JWT state
├── hooks/
│   └── useAuth.ts        # Custom hook for accessing auth context
├── lib/
│   └── constants.ts      # API base URL configuration (supports client proxy rewrites)
├── services/
│   └── api.ts            # Central API client (Login, Register, Logout, Me, Yahoo Stocks)
├── app/                  # Next.js App Router Pages
│   ├── login/page.tsx    # Login view matching AITrade reference design
│   ├── signup/page.tsx   # Signup view matching AITrade reference design
│   ├── page.tsx          # Authenticated Groww Dashboard & JWT Payload Tab
│   ├── layout.tsx        # App root layout with AuthProvider wrap
│   └── globals.css       # Tailwind CSS v4 design system tokens
├── middleware.ts         # Route protection middleware for /, /login, /signup
└── next.config.ts        # Proxy rewrites mapping /api/* -> http://localhost:5001/api/*
```

---

## ⚙️ 3. Backend Architecture & Route Endpoints (`backend/src/`)

The backend is built with Node.js, Express, TypeScript, and PostgreSQL.

### Core API Endpoints:

#### 🔐 Authentication Routes (`/api/auth/*`)
- `POST /api/auth/register` — Registers new user, generates verification token, sets HTTP-only JWT cookie.
- `POST /api/auth/login` — Authenticates email & password, returns user object, sets HTTP-only JWT cookie.
- `POST /api/auth/logout` — Clears JWT authentication cookie.
- `GET  /api/auth/me` — Fetches current authenticated user details.
- `GET  /api/auth/google` — Initiates Google OAuth 2.0 flow.
- `GET  /api/auth/google/callback` — Handles Google OAuth callback & user upsert.

#### 📈 Stock Market & Yahoo Finance Routes (`/api/stocks/*`)
- `GET /api/stocks/indices` — Live prices & % changes for **NIFTY 50**, **SENSEX**, **BANKNIFTY**, **MIDCPNIFTY**, and **FINNIFTY**.
- `GET /api/stocks/quotes?symbols=...` — Live prices, 1D change, volume, 52-week high/low metrics.
- `GET /api/stocks/history/:symbol?period=1mo` — Historical OHLCV candle data for charting.

#### 👤 User Management Routes (`/api/users/*`)
- `GET /api/users/profile` — Retrieves user profile & risk preferences.

---

## 🗄️ 4. Database Schema (`users` & `verification_tokens`)

```sql
-- Users Table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255),
  name VARCHAR(255) NOT NULL,
  is_verified BOOLEAN DEFAULT FALSE,
  google_id VARCHAR(255) UNIQUE,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Verification Tokens Table
CREATE TABLE verification_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  token VARCHAR(255) UNIQUE NOT NULL,
  type VARCHAR(50) NOT NULL, -- 'email_verify' | 'password_reset'
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

---

## 🔒 5. Environment & Security Isolation

To ensure no credentials or sensitive tokens are exposed to GitHub or Docker images:

1. **Ignored Environment Files**:
   - `.env`, `.env.local`, `.env*.local` are explicitly ignored in `.gitignore` and `.dockerignore`.
2. **Templates Provided**:
   - `.env.example` templates exist at root, `backend/.env.example`, and `frontend/.env.example`.
3. **CORS & Proxy Security**:
   - `next.config.ts` proxies `/api/*` requests to `http://localhost:5001/api/*`.
   - Backend `cors` dynamically validates local dev origins (`localhost:3000`, `localhost:3001`).

---

## 🚀 6. How to Run Locally

### 1. Backend Service
```bash
cd backend
npm install
npm run dev
# Running on http://localhost:5001
```

### 2. Frontend Service
```bash
cd frontend
npm install
npm run dev
# Running on http://localhost:3000 (or 3001)
```

---

## 👥 7. Team Task Assignment Guide

| Team Member Role | Focus Area & Assigned Modules |
| :--- | :--- |
| **Frontend UI/UX Lead** | Enhance Groww dashboard tabs (`Holdings`, `Positions`, `Orders`, `Watchlist`) in `frontend/src/components/`. |
| **Backend / API Lead** | Implement additional stock endpoint filters and connect database models in `backend/src/controllers/`. |
| **AI / ML Integration Lead** | Connect Python FastAPI AI microservice (`/ai/`) to feed predictions to `/api/stocks/`. |
| **Security & Auth Specialist** | Manage OAuth credentials and test JWT payload claims in `frontend/src/auth/jwt.ts`. |
