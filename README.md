# 🤖 AI-Powered Support Assistant

A full-stack AI-powered support assistant built with React, Node.js, SQLite, and Google Gemini AI. The assistant answers user questions strictly based on product documentation using RAG (Retrieval-Augmented Generation) with TF-IDF similarity search, maintains session-wise conversation context, and provides real-time streaming responses with live status updates.

![Node.js](https://img.shields.io/badge/Node.js-18+-green) ![React](https://img.shields.io/badge/React-18-blue) ![SQLite](https://img.shields.io/badge/SQLite-3-lightblue) ![Gemini](https://img.shields.io/badge/Gemini_AI-2.0_Flash-purple)

---

## ✨ Features

### Core Features
- 💬 **AI Chat Interface** — Beautiful chat UI with user/assistant message bubbles
- 📄 **Document-Grounded Answering** — AI only answers from `docs.json`, refuses unknown questions
- 🔍 **RAG with TF-IDF Similarity Search** — Finds relevant docs instead of sending full knowledge base
- 🧠 **Conversation Memory** — Last 5 message pairs as context from SQLite
- 📁 **Session Management** — UUID-based sessions stored in localStorage
- 💾 **SQLite Persistence** — All messages and sessions stored in SQLite database

### Bonus Features
- ⚡ **Real-time Streaming** — Word-by-word responses via Server-Sent Events (SSE)
- 🔄 **Live Status Updates** — Shows "Searching docs..." → "Analyzing context..." → "Generating..." stages
- 📝 **Markdown Rendering** — AI responses rendered with proper formatting
- 🐳 **Docker Support** — Full Dockerfiles + docker-compose.yml
- 🧪 **Unit Tests** — Backend tests with Jest + Supertest
- 🛡️ **Rate Limiting** — Per-IP rate limiting on all endpoints

### UI Features
- 🎨 **Premium Glassmorphic Dark UI** — Stunning dark theme with glass effects
- ✨ **Smooth Animations** — Message entry animations, typing indicator, status pulses
- 📱 **Fully Responsive** — Works on desktop, tablet, and mobile
- 💡 **Suggestion Chips** — Pre-built questions for easy onboarding
- 📋 **Session Sidebar** — Browse, switch, and delete past conversations
- 🆕 **New Chat Button** — Start fresh conversations anytime

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18, Vite, TailwindCSS v4, Lucide Icons, React Markdown, Framer Motion |
| **Backend** | Node.js, Express.js |
| **Database** | SQLite (via better-sqlite3) |
| **AI/LLM** | Google Gemini 2.0 Flash |
| **Rate Limiting** | express-rate-limit |
| **Testing** | Jest + Supertest |
| **Containerization** | Docker + docker-compose |

---

## 📁 Project Structure

```
weitre-ai/
├── frontend/                        # React Frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── chat/
│   │   │   │   ├── ChatHeader.jsx      # Header with branding
│   │   │   │   ├── MessageList.jsx     # Renders all messages
│   │   │   │   ├── MessageItem.jsx     # Individual message bubble
│   │   │   │   ├── MessageInput.jsx    # Input + send button
│   │   │   │   ├── TypingIndicator.jsx # Animated typing dots
│   │   │   │   ├── StatusIndicator.jsx # Live status stages
│   │   │   │   └── SuggestionChips.jsx # Quick question suggestions
│   │   │   └── sidebar/
│   │   │       └── SessionSidebar.jsx  # Session list + controls
│   │   ├── pages/
│   │   │   └── ChatPage.jsx           # Main page (orchestrates everything)
│   │   ├── services/
│   │   │   └── chatService.js         # API calls (axios + fetch for SSE)
│   │   ├── utils/
│   │   │   └── session.js             # Session ID + timestamp utils
│   │   ├── App.jsx                    # Root component
│   │   ├── main.jsx                   # Entry point
│   │   └── index.css                  # Design system (Tailwind v4)
│   ├── Dockerfile
│   ├── nginx.conf
│   └── package.json
│
├── backend/                          # Node.js Backend
│   ├── src/
│   │   ├── config/
│   │   │   └── env.js                 # Environment config + validation
│   │   ├── controllers/
│   │   │   └── chatController.js      # HTTP request/response handlers
│   │   ├── services/
│   │   │   ├── chatService.js         # Business logic orchestrator
│   │   │   ├── llmService.js          # Gemini AI integration + prompting
│   │   │   └── ragService.js          # TF-IDF similarity search (RAG)
│   │   ├── middleware/
│   │   │   ├── rateLimiter.js         # Per-IP rate limiting
│   │   │   ├── errorHandler.js        # Global error handling
│   │   │   └── validator.js           # Request validation
│   │   ├── db/
│   │   │   ├── database.js            # SQLite init + schema
│   │   │   └── queries.js             # All DB query functions
│   │   ├── data/
│   │   │   └── docs.json              # Product documentation (18 FAQs)
│   │   ├── routes/
│   │   │   └── chat.routes.js         # API route definitions
│   │   ├── __tests__/
│   │   │   └── chat.test.js           # Unit tests
│   │   └── app.js                     # Express server entry
│   ├── Dockerfile
│   ├── jest.config.js
│   └── package.json
│
├── docker-compose.yml                # Container orchestration
└── README.md                         # This file
```

---

## 🚀 Quick Start

### Prerequisites
- **Node.js 18+** (check: `node --version`)
- **npm 9+** (check: `npm --version`)
- **Google Gemini API key** — Get free at [aistudio.google.com/apikey](https://aistudio.google.com/apikey)

### 1. Clone & Install

```bash
# Clone the repository
git clone <repo-url>
cd weitre-ai

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Configure Environment

```bash
# Backend environment
cd backend
cp .env.example .env
# Edit .env and add your GEMINI_API_KEY
```

```env
PORT=5000
NODE_ENV=development
GEMINI_API_KEY=your-actual-gemini-api-key
CLIENT_URL=http://localhost:5173
```

### 3. Run Development Servers

```bash
# Terminal 1 — Backend (port 5000)
cd backend
npm run dev

# Terminal 2 — Frontend (port 5173)
cd frontend
npm run dev
```

### 4. Open Browser

Visit **[http://localhost:5173](http://localhost:5173)**

---

## 🔑 API Documentation

### Base URL: `http://localhost:5000/api`

### ✅ POST `/api/chat` — Send Message

Send a user message and receive an AI response.

**Request:**
```json
{
    "sessionId": "550e8400-e29b-41d4-a716-446655440000",
    "message": "How can I reset my password?"
}
```

**Response (200):**
```json
{
    "success": true,
    "reply": "To reset your password, go to **Settings > Security > Change Password**...",
    "tokensUsed": 156,
    "docsUsed": [
        { "title": "Reset Password", "score": "0.1823" }
    ]
}
```

**Error (400):**
```json
{
    "success": false,
    "error": "Missing or invalid \"sessionId\". Must be a non-empty string."
}
```

---

### ✅ POST `/api/chat/stream` — Send Message (Streaming)

Same as `/api/chat` but returns Server-Sent Events with live status updates.

**Request:** Same as POST `/api/chat`

**Response (SSE stream):**
```
data: {"type":"status","stage":"searching","message":"🔍 Searching documentation..."}

data: {"type":"status","stage":"docs_found","message":"📄 Found 2 relevant document(s)"}

data: {"type":"status","stage":"analyzing","message":"🧠 Analyzing conversation context..."}

data: {"type":"status","stage":"generating","message":"✍️ Generating response..."}

data: {"type":"chunk","content":"To reset"}

data: {"type":"chunk","content":" your password"}

data: {"type":"complete","tokensUsed":156}

data: [DONE]
```

---

### ✅ GET `/api/conversations/:sessionId` — Get Conversation

Returns all messages for a session in chronological order.

**Response (200):**
```json
{
    "success": true,
    "sessionId": "550e8400-e29b-41d4-a716-446655440000",
    "messages": [
        {
            "id": 1,
            "session_id": "550e8400...",
            "role": "user",
            "content": "How do I reset my password?",
            "tokens_used": 0,
            "created_at": "2026-02-24 10:30:00"
        },
        {
            "id": 2,
            "session_id": "550e8400...",
            "role": "assistant",
            "content": "To reset your password...",
            "tokens_used": 156,
            "created_at": "2026-02-24 10:30:02"
        }
    ]
}
```

---

### ✅ GET `/api/sessions` — List All Sessions

**Response (200):**
```json
{
    "success": true,
    "sessions": [
        {
            "id": "550e8400-e29b-41d4-a716-446655440000",
            "created_at": "2026-02-24 10:30:00",
            "updated_at": "2026-02-24 10:35:00",
            "message_count": 6,
            "first_message": "How do I reset my password?"
        }
    ]
}
```

---

### ✅ DELETE `/api/sessions/:sessionId` — Delete Session

Deletes a session and all its messages.

**Response (200):**
```json
{
    "success": true,
    "message": "Session deleted successfully"
}
```

---

### ✅ GET `/health` — Health Check

```json
{
    "success": true,
    "status": "healthy",
    "timestamp": "2026-02-24T10:30:00.000Z",
    "uptime": 3600
}
```

---

## 🗄️ Database Schema

### SQLite Database: `support_assistant.db`

#### Table: `sessions`
| Column | Type | Description |
|--------|------|-------------|
| `id` | TEXT (PK) | UUID session identifier |
| `created_at` | DATETIME | Auto-set on creation |
| `updated_at` | DATETIME | Updated on each new message |

#### Table: `messages`
| Column | Type | Description |
|--------|------|-------------|
| `id` | INTEGER (PK) | Auto-incrementing ID |
| `session_id` | TEXT (FK) | References sessions.id |
| `role` | TEXT | "user" or "assistant" |
| `content` | TEXT | Message text |
| `tokens_used` | INTEGER | LLM tokens consumed |
| `created_at` | DATETIME | Auto-set on creation |

**Indexes:**
- `idx_messages_session_id` — Fast message lookup by session
- `idx_messages_created_at` — Chronological ordering
- `idx_sessions_updated_at` — Session list sorting

**Foreign Key:** `messages.session_id → sessions.id` (CASCADE DELETE)

---

## 🔍 RAG Pipeline

Instead of sending the entire `docs.json` to the LLM, we use **TF-IDF similarity search**:

1. **Indexing** — On server start, all documents are tokenized and TF-IDF weights are calculated
2. **Query** — User's question is tokenized and stop words are removed
3. **Scoring** — Each document is scored against the query using TF-IDF cosine similarity
4. **Retrieval** — Top 3 most relevant documents are selected
5. **Injection** — Only relevant docs are included in the LLM prompt

This approach:
- ✅ Reduces token usage (only sends relevant docs)
- ✅ Improves answer accuracy (less noise)
- ✅ Scales better with large document sets

---

## 🧪 Running Tests

```bash
cd backend
npm test
```

Tests cover:
- All API endpoints (sessions, chat, conversations)
- Input validation (missing fields)
- Database operations (CRUD, message pairs, limits)
- Session lifecycle (create, query, delete)

---

## 🐳 Docker Deployment

```bash
# Build and run both services
docker-compose up --build

# Frontend: http://localhost:80
# Backend:  http://localhost:5000
```

---

## 🚀 Deployment (Vercel + Render)

### Frontend → Vercel

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) → Import Project
3. Select the `frontend` folder as the root directory
4. Set Framework: **Vite**
5. Add Environment Variable:
   - `VITE_API_URL` = `https://weitre-ai-backend.onrender.com`
6. Deploy!

### Backend → Render

1. Go to [render.com](https://render.com) → New Web Service
2. Connect your GitHub repo
3. Configure:
   - **Root Directory:** `backend`
   - **Build Command:** `npm ci`
   - **Start Command:** `npm start`
   - **Environment:** Node
4. Add Environment Variables:
   - `GEMINI_API_KEY` = your Gemini API key
   - `CLIENT_URL` = your Vercel frontend URL
   - `NODE_ENV` = `production`
   - `PORT` = `5000`
5. Deploy!

Or use the **Render Blueprint** (`render.yaml` at project root) for one-click setup.

---

## 🔄 CI/CD Pipeline

GitHub Actions workflow (`.github/workflows/ci-cd.yml`) runs on every push:

| Stage | Trigger | Action |
|-------|---------|--------|
| 🧪 **Backend Tests** | Push to any branch | Runs Jest + Supertest |
| 🏗️ **Frontend Build** | Push to any branch | Validates Vite build |
| 🚀 **Deploy Backend** | Push to `main` only | Triggers Render deploy hook |
| 🚀 **Deploy Frontend** | Push to `main` only | Deploys to Vercel |

### Required GitHub Secrets

| Secret | Description |
|--------|-------------|
| `RENDER_DEPLOY_HOOK_URL` | Render deploy hook URL |
| `VERCEL_TOKEN` | Vercel API token |
| `VERCEL_ORG_ID` | Vercel organization ID |
| `VERCEL_PROJECT_ID` | Vercel project ID |

---

## 📝 Assumptions

1. **No authentication required** — Sessions are identified by UUID stored in localStorage
2. **Document-only answering** — AI strictly refuses questions not covered in `docs.json`
3. **Context window** — Last 5 user+assistant message pairs are sent as context to maintain conversation flow
4. **Rate limiting** — 100 requests per 15min for general API, 15/min for chat
5. **Session persistence** — Sessions persist until explicitly deleted; no auto-expiry
6. **SSE for streaming** — Server-Sent Events used for real-time response streaming
7. **Gemini 2.5 Flash** — Chosen for fast response times and free tier availability

---

## 🌐 Live Demo

- **Frontend:** [https://weitre-ai.vercel.app](https://weitre-ai.vercel.app)
- **Backend:** [https://weitre-ai-backend.onrender.com](https://weitre-ai-backend.onrender.com)

---

Built with ❤️ for the Weitredge AI Assignment
