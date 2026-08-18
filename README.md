# AI-Based Stock Market Prediction and Investment Assistant

This repository contains the local development setup for the **AI-Based Stock Market Prediction and Investment Assistant** system.

The project is structured with a decoupled **Frontend** (Next.js + TS + Tailwind), **Backend** (Node.js + Express + TS), and **AI** layer (Python + FastAPI) orchestrating around PostgreSQL and Redis.

---

## 📁 Folder Structure

```
Ai-Stock-AnlyasisSystem/
├── docker-compose.yml       # Docker Compose configuration for all services
├── README.md                # Project documentation & setup instructions
├── frontend/                # Next.js web application (React, TypeScript, Tailwind)
│   ├── Dockerfile
│   ├── package.json
│   ├── src/                 # Next.js App Router and Components
│   └── ...
├── backend/                 # Node.js Express API (TypeScript)
│   ├── Dockerfile
│   ├── package.json
│   ├── tsconfig.json
│   ├── src/                 # API Routes, Controllers, Models
│   └── ...
└── ai/                      # Python FastAPI (PyTorch, scikit-learn)
    ├── Dockerfile
    ├── requirements.txt
    ├── main.py              # FastAPI entry point
    └── ...
```

---

## 🛠️ Local Development Setup & How to Run

### Prerequisites
- **Docker** and **Docker Compose**

### 1. Running the Full Stack (Docker Compose)

Navigate to the project root and start all services via Docker:

```bash
docker compose up -d
```

This will build and start 5 containers:
1. `ai_stock_frontend` (Next.js) -> **`http://localhost:3000`**
2. `ai_stock_backend` (Express) -> **`http://localhost:5000`**
3. `ai_stock_ai` (FastAPI) -> **`http://localhost:8000`**
4. `ai_stock_postgres` (PostgreSQL) -> Port **`5432`**
5. `ai_stock_redis` (Redis) -> Port **`6379`**

### 2. Verify Services

#### Backend Health-Check
```http
GET http://localhost:5000/api/health
```

#### AI Health-Check
```http
GET http://localhost:8000/api/health
```

#### Frontend UI
Visit [http://localhost:3000](http://localhost:3000) in your browser.