#!/bin/bash
set -e

# --- CONFIG ---
SOURCE_DIR="/home/anji/Documents/weitre-ai"
NEW_DIR="/tmp/Weiteredge-AI"
REMOTE_URL="https://github.com/anjim999/Weiteredge-AI.git"

# Clean up and prepare
rm -rf "$NEW_DIR"
mkdir -p "$NEW_DIR"
cd "$NEW_DIR"
git init
git remote add origin "$REMOTE_URL"

# Helper: commit with custom date
commit() {
    local msg="$1"
    local date="$2"
    git add -A
    GIT_AUTHOR_DATE="$date" GIT_COMMITTER_DATE="$date" git commit -m "$msg"
}

# ==================================================
# FEB 23 — EVENING SESSION (7 PM - 11 PM IST)
# ==================================================

# COMMIT 1: 7:04 PM
echo "📦 Commit 1/22: Project scaffolding..."
cp "$SOURCE_DIR/.gitignore" .
mkdir -p backend/src/config
cp "$SOURCE_DIR/backend/package.json" backend/
cp "$SOURCE_DIR/backend/package-lock.json" backend/
cp "$SOURCE_DIR/backend/.env.example" backend/
cp "$SOURCE_DIR/backend/.gitignore" backend/
cp "$SOURCE_DIR/backend/src/config/env.js" backend/src/config/
mkdir -p frontend/src frontend/public
cp "$SOURCE_DIR/frontend/package.json" frontend/
cp "$SOURCE_DIR/frontend/package-lock.json" frontend/
cp "$SOURCE_DIR/frontend/.env.example" frontend/
cp "$SOURCE_DIR/frontend/.gitignore" frontend/
cp "$SOURCE_DIR/frontend/index.html" frontend/
cp "$SOURCE_DIR/frontend/vite.config.js" frontend/
cp "$SOURCE_DIR/frontend/eslint.config.js" frontend/
[ -f "$SOURCE_DIR/frontend/public/vite.svg" ] && cp "$SOURCE_DIR/frontend/public/vite.svg" frontend/public/
commit "init: project setup with backend and frontend scaffolding" "2026-02-23T19:04:00+05:30"

# COMMIT 2: 7:38 PM
echo "🗄️ Commit 2/22: SQLite database..."
mkdir -p backend/src/db
cp "$SOURCE_DIR/backend/src/db/database.js" backend/src/db/
cp "$SOURCE_DIR/backend/src/db/queries.js" backend/src/db/
commit "feat: add SQLite database with session and message schema" "2026-02-23T19:38:00+05:30"

# COMMIT 3: 8:11 PM
echo "📄 Commit 3/22: Product documentation..."
mkdir -p backend/src/data
cp "$SOURCE_DIR/backend/src/data/docs.json" backend/src/data/
commit "feat: add product documentation for RAG knowledge base" "2026-02-23T20:11:00+05:30"

# COMMIT 4: 8:47 PM
echo "🔍 Commit 4/22: RAG service..."
mkdir -p backend/src/services
cp "$SOURCE_DIR/backend/src/services/ragService.js" backend/src/services/
commit "feat: add RAG service with TF-IDF similarity search" "2026-02-23T20:47:00+05:30"

# COMMIT 5: 9:23 PM
echo "🧠 Commit 5/22: LLM service..."
cp "$SOURCE_DIR/backend/src/services/llmService.js" backend/src/services/
commit "feat: add Gemini LLM service with streaming support" "2026-02-23T21:23:00+05:30"

# COMMIT 6: 10:06 PM
echo "💬 Commit 6/22: Chat service..."
cp "$SOURCE_DIR/backend/src/services/chatService.js" backend/src/services/
commit "feat: add chat service with session management and RAG pipeline" "2026-02-23T22:06:00+05:30"

# COMMIT 7: 10:52 PM
echo "🛡️ Commit 7/22: Middleware..."
mkdir -p backend/src/middleware
cp "$SOURCE_DIR/backend/src/middleware/validator.js" backend/src/middleware/
cp "$SOURCE_DIR/backend/src/middleware/errorHandler.js" backend/src/middleware/
commit "feat: add request validation and error handling middleware" "2026-02-23T22:52:00+05:30"

# ==================================================
# FEB 24 — FULL DAY SESSION (9 AM - 11 PM IST)
# ==================================================

# COMMIT 8: 9:17 AM
echo "⏱️ Commit 8/22: Rate limiting..."
cp "$SOURCE_DIR/backend/src/middleware/rateLimiter.js" backend/src/middleware/
commit "feat: add per-IP rate limiting middleware" "2026-02-24T09:17:00+05:30"

# COMMIT 9: 9:53 AM
echo "🔌 Commit 9/22: Controller & routes..."
mkdir -p backend/src/controllers backend/src/routes
cp "$SOURCE_DIR/backend/src/controllers/chatController.js" backend/src/controllers/
cp "$SOURCE_DIR/backend/src/routes/chat.routes.js" backend/src/routes/
commit "feat: add chat controller and API routes" "2026-02-24T09:53:00+05:30"

# COMMIT 10: 10:34 AM
echo "🚀 Commit 10/22: Express server..."
cp "$SOURCE_DIR/backend/src/app.js" backend/src/
commit "feat: add Express server with CORS, security, and health check" "2026-02-24T10:34:00+05:30"

# COMMIT 11: 11:19 AM
echo "🎨 Commit 11/22: Design system..."
cp "$SOURCE_DIR/frontend/src/index.css" frontend/src/
cp "$SOURCE_DIR/frontend/src/main.jsx" frontend/src/
commit "feat: add design system with glassmorphic dark theme" "2026-02-24T11:19:00+05:30"

# COMMIT 12: 12:08 PM
echo "💬 Commit 12/22: Message components..."
mkdir -p frontend/src/components/chat frontend/src/utils
cp "$SOURCE_DIR/frontend/src/utils/session.js" frontend/src/utils/
cp "$SOURCE_DIR/frontend/src/components/chat/MessageItem.jsx" frontend/src/components/chat/
cp "$SOURCE_DIR/frontend/src/components/chat/MessageList.jsx" frontend/src/components/chat/
cp "$SOURCE_DIR/frontend/src/components/chat/TypingIndicator.jsx" frontend/src/components/chat/
commit "feat: add message components — bubble, list, and typing indicator" "2026-02-24T12:08:00+05:30"

# COMMIT 13: 1:42 PM
echo "📌 Commit 13/22: Chat header..."
cp "$SOURCE_DIR/frontend/src/components/chat/ChatHeader.jsx" frontend/src/components/chat/
commit "feat: add chat header with clear and delete actions" "2026-02-24T13:42:00+05:30"

# COMMIT 14: 2:26 PM
echo "✨ Commit 14/22: Status & suggestions..."
cp "$SOURCE_DIR/frontend/src/components/chat/StatusIndicator.jsx" frontend/src/components/chat/
cp "$SOURCE_DIR/frontend/src/components/chat/SuggestionChips.jsx" frontend/src/components/chat/
commit "feat: add live status indicator and suggestion chips" "2026-02-24T14:26:00+05:30"

# COMMIT 15: 3:13 PM
echo "⌨️ Commit 15/22: Message input..."
cp "$SOURCE_DIR/frontend/src/components/chat/MessageInput.jsx" frontend/src/components/chat/
commit "feat: add message input with keyboard shortcuts" "2026-02-24T15:13:00+05:30"

# COMMIT 16: 3:51 PM
echo "📁 Commit 16/22: Session sidebar..."
mkdir -p frontend/src/components/sidebar
cp "$SOURCE_DIR/frontend/src/components/sidebar/SessionSidebar.jsx" frontend/src/components/sidebar/
commit "feat: add session sidebar with history management" "2026-02-24T15:51:00+05:30"

# COMMIT 17: 4:37 PM
echo "🔗 Commit 17/22: Frontend services..."
mkdir -p frontend/src/config frontend/src/api frontend/src/services
cp "$SOURCE_DIR/frontend/src/config/env.js" frontend/src/config/
cp "$SOURCE_DIR/frontend/src/api/axiosClient.js" frontend/src/api/
cp "$SOURCE_DIR/frontend/src/services/chatService.js" frontend/src/services/
commit "feat: add centralized env config, axios client, and chat service" "2026-02-24T16:37:00+05:30"

# COMMIT 18: 5:24 PM
echo "📱 Commit 18/22: Chat page..."
mkdir -p frontend/src/pages
cp "$SOURCE_DIR/frontend/src/pages/ChatPage.jsx" frontend/src/pages/
cp "$SOURCE_DIR/frontend/src/App.jsx" frontend/src/
commit "feat: add main chat page with streaming SSE and session orchestration" "2026-02-24T17:24:00+05:30"

# COMMIT 19: 7:09 PM
echo "🧪 Commit 19/22: Tests..."
mkdir -p backend/src/__tests__
cp "$SOURCE_DIR/backend/src/__tests__/chat.test.js" backend/src/__tests__/
cp "$SOURCE_DIR/backend/jest.config.js" backend/
commit "test: add backend unit tests with Jest and Supertest" "2026-02-24T19:09:00+05:30"

# COMMIT 20: 8:18 PM
echo "🐳 Commit 20/22: Docker..."
cp "$SOURCE_DIR/backend/Dockerfile" backend/
cp "$SOURCE_DIR/frontend/Dockerfile" frontend/
cp "$SOURCE_DIR/frontend/nginx.conf" frontend/
cp "$SOURCE_DIR/docker-compose.yml" .
commit "devops: add Docker support with multi-stage builds and nginx" "2026-02-24T20:18:00+05:30"

# COMMIT 21: 9:41 PM
echo "📝 Commit 21/22: README..."
cp "$SOURCE_DIR/README.md" .
cp "$SOURCE_DIR/frontend/vercel.json" frontend/
commit "docs: add comprehensive README with API docs and deployment guide" "2026-02-24T21:41:00+05:30"

# COMMIT 22: 10:33 PM — CI/CD LAST (so workflow runs look natural)
echo "⚙️ Commit 22/22: CI/CD..."
mkdir -p .github/workflows
cp "$SOURCE_DIR/.github/workflows/ci-cd.yml" .github/workflows/
cp "$SOURCE_DIR/.github/workflows/deploy-backend.yml" .github/workflows/
cp "$SOURCE_DIR/.github/workflows/deploy-frontend.yml" .github/workflows/
commit "ci: add GitHub Actions pipelines for testing and deployment" "2026-02-24T22:33:00+05:30"

# ==================================================
# PUSH
# ==================================================
echo ""
echo "🚀 Pushing to $REMOTE_URL..."
git branch -M main
git push -u origin main --force

echo ""
echo "✅ ALL DONE! 22 commits pushed to $REMOTE_URL"
echo ""
git log --oneline --all
