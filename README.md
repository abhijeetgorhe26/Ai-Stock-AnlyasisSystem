# AI-Based Stock Market Prediction and Investment Assistant

This repository contains the initial local development setup for the **AI-Based Stock Market Prediction and Investment Assistant** system.

The project is structured with a decoupled **Frontend** (React + Vite) and **Backend** (Node.js + Express) following the Model-View-Controller (MVC) architectural pattern.

---

## 📁 Folder Structure

```
Ai-Stock-AnlyasisSystem/
├── .gitignore               # Root gitignore
├── README.md                # Project documentation & setup instructions
├── backend/                 # Express Node.js API server (MVC)
│   ├── .env.example         # Template environment variables
│   ├── .gitignore           # Backend gitignore
│   ├── package.json         # Backend dependencies & scripts
│   └── src/
│       ├── server.js        # Server listener entry point
│       ├── app.js           # Express app setup & middleware mount
│       ├── config/          # Environment configuration loader
│       ├── controllers/     # MVC Controllers (request & response logic)
│       ├── middleware/      # Global middleware (e.g. error handling)
│       ├── models/          # MVC Models (Data models & schemas placeholder)
│       ├── routes/          # Express API route declarations
│       ├── services/        # Service layer placeholder (business logic & external APIs)
│       ├── utils/           # Shared utility helper functions
│       └── views/           # MVC Views (view layer & payload formatters)
└── frontend/                # React.js application (Vite toolchain)
    ├── .env.example         # Template frontend environment variables
    ├── .gitignore           # Frontend gitignore
    ├── index.html           # HTML entry point
    ├── package.json         # Frontend dependencies & scripts
    ├── vite.config.js       # Vite configuration
    └── src/
        ├── App.jsx          # Root React component
        ├── index.css        # Global CSS styling
        ├── main.jsx         # React DOM root render
        └── components/      # UI components placeholder
```

---

## 📂 Folder Responsibilities

### Backend (`backend/`)
- **`src/controllers/`**: Handles incoming HTTP requests, invokes services/models, and returns HTTP responses.
- **`src/models/`**: Defines data structures, schemas (e.g., MongoDB/Mongoose models), and database access logic.
- **`src/views/`**: Decoupled view layer for custom response formatting, templates, or serialized payloads.
- **`src/routes/`**: Express routes defining API endpoints and mapping them to corresponding controllers.
- **`src/middleware/`**: Functions that execute during the request-response lifecycle (e.g. error handler, CORS).
- **`src/services/`**: Holds core business logic, stock prediction algorithms, FinBERT sentiment services, and external API wrappers.
- **`src/config/`**: Manages environment variables and application settings.
- **`src/utils/`**: Reusable helper functions and utilities.

### Frontend (`frontend/`)
- **`src/components/`**: Modular, reusable React UI components.
- **`src/App.jsx`**: Main application container component.
- **`src/main.jsx`**: Entry point that mounts the React app onto the HTML DOM.

---

## 🛠️ Local Development Setup & How to Run

### Prerequisites
- **Node.js**: `v18.x` or higher
- **npm**: `v9.x` or higher

---

### 1. Running the Backend (Express Server)

Navigate to the `backend` directory, install dependencies, and start the server:

```bash
cd backend
npm install
npm run dev
```

The backend server will start locally at **`http://localhost:5000`**.

#### Health-Check Endpoint
Verify that the backend server is running cleanly by accessing:
```http
GET http://localhost:5000/api/health
```

Sample Response:
```json
{
  "status": "success",
  "message": "Backend server is running successfully",
  "timestamp": "2026-08-09T22:00:00.000Z",
  "uptime": 4.12
}
```

---

### 2. Running the Frontend (React Application)

Open a new terminal window, navigate to the `frontend` directory, install dependencies, and start the development server:

```bash
cd frontend
npm install
npm run dev
```

The Vite dev server will launch the React application at **`http://localhost:5173`**.

---

## 🔐 Environment Configuration

- **Backend**: Copy `backend/.env.example` to `backend/.env` if you need custom port or origin overrides.
- **Frontend**: Copy `frontend/.env.example` to `frontend/.env` if you need custom API base URL overrides.

*Note: No secret keys or real credentials should be placed in `.env.example`.*