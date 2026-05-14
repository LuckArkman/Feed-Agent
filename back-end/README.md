# WhatsApp Broadcast Scaling Engine (Feed-Agent Backend)

Robust, enterprise-ready, multi-tenant API designed for orchestrating WhatsApp news broadcasts with automated OCR preprocessing, AI draft generation, real-time job queues, and resilient distribution.

---

## 🚀 Key Features

1. **OCR Preprocessing**: Extracts text from raw image/PDF uploads via Tesseract OCR.
2. **AI-Assisted News Generation**: Transforms unstructured source text into structured markdown articles via the local Llama LLM.
3. **Resilient Distribution Queue**: Relies on BullMQ/Redis for managing large-scale, high-concurrency WhatsApp broadcast streams with exponential backoff (60s base delay).
4. **WhatsApp session isolation**: Integrates with Baileys websocket core safely mapping multi-tenant user authentication scopes.
5. **Security Hardening**: Secure production headers via `helmet`, endpoint-specific rate-limiting with `express-rate-limit`, and production error logging sanitization (stripping credentials and JWTs).
6. **Containerized Stack**: Multi-stage production `Dockerfile` running as non-root `node` user and secured, isolated network architecture.

---

## 📁 System Architecture

```mermaid
graph TD
    Client[Vue 3 Frontend] -->|HTTP / SSE| Express[Express API Router]
    Express -->|Auth| PG[(PostgreSQL - Users / Drafts)]
    Express -->|Heavy Workload| OCR_Queue[BullMQ OCR Queue]
    OCR_Queue -->|OCR Processing| Tesseract[Tesseract OCR Engine]
    Express -->|LLM Prompts| Llama[Llama 3.1 LLM]
    Express -->|Approve Broadcast| BC_Queue[BullMQ Broadcast Queue]
    BC_Queue -->|Stream Distribution| Worker[Broadcast Processor]
    Worker -->|WhatsApp API| Baileys[Baileys Socket Connection]
    Worker -->|Log Event| Mongo[(MongoDB - Broadcast Logs)]
```

---

## 🛠️ Environment Variables (.env)

Create a `.env` file in the root folder with the following variables:

```env
# Server Configs
PORT=3000
NODE_ENV=production
JWT_SECRET=your_32_characters_long_jwt_secret_key

# PostgreSQL Core Database Connection
DATABASE_URL="postgresql://admin:admin123@postgres:5432/feed_agent?schema=public"

# MongoDB Log Storage Connection
MONGODB_URI="mongodb://root:root123@mongodb:27017/feed_agent?authSource=admin"

# Redis Queue Connection
REDIS_URL="redis://redis:6379"

# AI & external services URLs
LLAMA_BASE_URL="http://localhost:11434"
```

---

## 📦 Single-Click Production Launch

Ensure you have **Docker** and **Docker Compose** installed.

To build and run the entire infrastructure in a secure, production-hardened network environment:

```bash
# Start the production stack in background
docker-compose up -d --build
```

The app will be accessible at `http://localhost:3000`.

### Database Migrations
On the initial start, execute migrations to set up the PostgreSQL database schema:

```bash
docker-compose exec backend npx prisma migrate deploy
```

---

## 💻 Local Development Setup

To run the backend locally outside of Docker containers:

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Database setup**:
   Make sure you have local PostgreSQL, MongoDB, and Redis instances running.
   ```bash
   npx prisma migrate dev
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

---

## 🧪 Testing Suite

We provide 100% mocked offline unit and integration tests, making it safe to run in any CI environment without needing database configurations or active connections.

```bash
# Run unit and integration tests
npm run test

# Run tests with HTML coverage report
npm run test:coverage
```

---

## 🔒 Security Hardening Policies

- **Endpoint Rate Limiting**:
  - `/api/auth/login` / `/register`: Max 10 requests / 15 mins (brute-force prevention).
  - `/api/news/generate-draft` / `/upload`: Max 30 requests / hr (resource exhaustion prevention).
  - Global: Max 1000 requests / 15 mins.
- **Data Isolation**: Database instances (`postgres`, `mongodb`, `redis`) are locked inside Docker's internal `private-network` and are **not** exposed to the host machine or public ports.
- **Error Sanitization**: Connection strings (`postgres://`, `mongodb://`) and JWT signatures are parsed out and sanitized dynamically in production logs to prevent leakage of credentials.
