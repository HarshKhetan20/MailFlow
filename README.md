# MailFlow

> Production-ready, conversational voice-first email assistant built with React, TypeScript, FastAPI, and OpenAI / Gmail API.

---

## 🌟 Features (V1)

- **Voice-First Executive Assistant**: Communicate naturally hands-free using voice.
- **Dual Composition Workflows**:
  - **Manual Composition**: Dictate Recipient, Subject, and Body step-by-step.
  - **AI Composer**: Provide Topic, Tone, and Specifics to auto-generate structured emails.
- **10 AI Tone & Refinement Suggester Chips**: One-click tone optimization (Professional, Friendly, Formal, Casual, Polite, Persuasive, Apologetic, Appreciative, Shorten, Expand).
- **Targeted Section-Level Edits**: Natural edit commands like *"rewrite the introduction"*, *"replace the closing"*, or *"remove the last sentence"*.
- **Real-Time Live Email Preview Card**: Instant draft preview with inline recipient validation.
- **Explicit Send Confirmation**: Guarantees emails are never sent without user confirmation.
- **Gmail API Integration**: Secure Google OAuth 2.0 flow & MIME message delivery.
- **Executive Dark Glassmorphic UI**: Pulsing voice visualizer rings, accessible ARIA labels, and responsive layout.

---

## 📁 Repository Structure

```text
voicemail-ai-agent/
├── frontend/                 # React 19 + TypeScript + Vite + Zustand + Tailwind Web App
│   ├── src/
│   │   ├── app/             # React Router (/ , /login, /oauth/callback)
│   │   ├── components/      # Common, Layout, Conversation, Draft, Voice components
│   │   ├── engine/          # State machine logic & helpers
│   │   ├── hooks/           # useConversation, useDraft, useVoice, useSpeechRecognition, useTextToSpeech
│   │   ├── services/        # Isolated API service layer (Speech, Composer, Suggestion, Gmail)
│   │   ├── store/           # Zustand stores (conversationStore, draftStore, voiceStore, authStore)
│   │   ├── styles/          # Dark glassmorphism design system & animations
│   │   └── types/           # Strict TypeScript interfaces (no `any`)
│   ├── package.json
│   └── vite.config.ts
│
├── backend/                  # Python 3.12 + FastAPI + SQLAlchemy + Uvicorn API Service
│   ├── app/
│   │   ├── ai/              # AI Layer (IntentAnalyzer, EmailComposerAI, SubjectGenerator, RewriteEngine)
│   │   ├── api/             # REST Endpoints (/conversation, /composer, /suggestions, /gmail, /auth)
│   │   ├── auth/            # Google OAuth 2.0 router
│   │   ├── composer/        # AI Composer service module
│   │   ├── conversation/    # State machine engine & rules
│   │   ├── core/            # Config & pydantic-settings
│   │   ├── database/        # SQLAlchemy engine & SQLite session setup
│   │   ├── gmail/           # Gmail API delivery service
│   │   ├── models/          # User, SessionModel, DraftModel tables
│   │   ├── repositories/    # Repository pattern for database access
│   │   ├── schemas/         # Pydantic v2 schemas
│   │   ├── suggestions/     # Suggester service module
│   │   └── main.py          # FastAPI entrypoint & /health check
│   ├── requirements.txt
│   └── .env.example
│
└── database/                 # Database migrations & schemas documentation
    └── README.md
```

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js v18+
- Python v3.12+
- `uv` Python package manager (Recommended)

### 1. Start the Backend API Server
```bash
cd backend
uv pip install -r requirements.txt
uv run uvicorn app.main:app --port 8000 --reload
```
The FastAPI backend will run at `http://localhost:8000`. You can test health status at `http://localhost:8000/health`.

### 2. Start the Frontend Web Application
```bash
cd frontend
npm install
npm run dev
```
Open your browser at `http://localhost:5173`.

---

## ⚙️ Environment Variables

Create a `.env` file in `backend/`:

```env
PROJECT_NAME="VoiceMail AI Agent API"
VERSION="1.0.0"
API_V1_STR="/api/v1"

OPENAI_API_KEY="your-openai-api-key"
GOOGLE_CLIENT_ID="your-google-oauth-client-id"
GOOGLE_CLIENT_SECRET="your-google-oauth-client-secret"

DATABASE_URL="sqlite:///./voicemail.db"
SECRET_KEY="your-production-secret-key"
```

---

## 🧪 Testing & Build Instructions

### Backend Test & Build Verification
```bash
cd backend
uv run python -m py_compile app/main.py
```

### Frontend Production Build
```bash
cd frontend
npm run build
```
Production assets will compile into `frontend/dist/`.

---

## 🛡️ Security & Accessibility

- **No Exposed Secrets**: Frontend never handles OAuth Client Secrets or LLM API keys.
- **Structured Error Handling**: Stack traces are sanitized before sending responses to clients.
- **Sanitized Logging**: Email body content and secret tokens are stripped from logs.
- **Accessibility**: Keyboard navigable controls, ARIA labels, and high-contrast text ratios.
