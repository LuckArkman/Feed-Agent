"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const prismaClient_1 = __importDefault(require("./models/prismaClient"));
const mongoClient_1 = require("./models/mongoClient");
const logger_1 = __importDefault(require("./utils/logger"));
const errorHandler_1 = require("./middlewares/errorHandler");
const swagger_1 = require("./config/swagger");
const health_routes_1 = __importDefault(require("./routes/health.routes"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const contacts_routes_1 = __importDefault(require("./routes/contacts.routes"));
const whatsapp_routes_1 = __importDefault(require("./routes/whatsapp.routes"));
const news_routes_1 = __importDefault(require("./routes/news.routes"));
const draft_routes_1 = __importDefault(require("./routes/draft.routes"));
const analytics_routes_1 = __importDefault(require("./routes/analytics.routes"));
const WhatsAppService_1 = __importDefault(require("./services/WhatsAppService"));
const FeedHistoryService_1 = __importDefault(require("./services/FeedHistoryService"));
const cleanupCron_1 = require("./crons/cleanupCron");
// Initialize BullMQ Workers
require("./queues/ocrQueue");
require("./queues/broadcastQueue");
// ─────────────────────────────────────────────────────────────────────────────
// Global Process Error Guards — must be the first listeners registered
// ─────────────────────────────────────────────────────────────────────────────
process.on('uncaughtException', (err) => {
    logger_1.default.error(`Uncaught Exception: ${err.message}`, { stack: err.stack });
    process.exit(1);
});
process.on('unhandledRejection', (reason) => {
    logger_1.default.error(`Unhandled Rejection: ${String(reason)}`);
    process.exit(1);
});
dotenv_1.default.config();
const helmet_1 = __importDefault(require("helmet"));
const rateLimiter_1 = require("./middlewares/rateLimiter");
// ─────────────────────────────────────────────────────────────────────────────
// Express App Bootstrap
// ─────────────────────────────────────────────────────────────────────────────
const app = (0, express_1.default)();
exports.app = app;
const port = process.env.PORT || 3000;
// Security Headers
app.use((0, helmet_1.default)());
// Global Rate Limiting
app.use(rateLimiter_1.globalLimiter);
// CORS — only allow the Vue 3 dashboard origin
const allowedOrigins = (process.env.ALLOWED_ORIGINS || 'http://localhost:5173').split(',');
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        }
        else {
            callback(new Error(`CORS policy: Origin '${origin}' is not allowed.`));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
// Body parsers
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
// ─────────────────────────────────────────────────────────────────────────────
// Swagger UI  →  /api-docs
// ─────────────────────────────────────────────────────────────────────────────
(0, swagger_1.setupSwagger)(app);
// ─────────────────────────────────────────────────────────────────────────────
// Routes
// ─────────────────────────────────────────────────────────────────────────────
app.use('/health', health_routes_1.default);
app.use('/api/auth', auth_routes_1.default);
app.use('/api/contacts', contacts_routes_1.default);
app.use('/api/whatsapp', whatsapp_routes_1.default);
app.use('/api/news', news_routes_1.default);
app.use('/api/drafts', draft_routes_1.default);
app.use('/api/analytics', analytics_routes_1.default);
// ─────────────────────────────────────────────────────────────────────────────
// Global Error Handler — MUST be the last middleware
// ─────────────────────────────────────────────────────────────────────────────
app.use(errorHandler_1.errorHandler);
// ─────────────────────────────────────────────────────────────────────────────
// Server Startup
// ─────────────────────────────────────────────────────────────────────────────
async function startServer() {
    try {
        await prismaClient_1.default.$connect();
        logger_1.default.info('[postgres]: Connected to PostgreSQL successfully via Prisma.');
        await (0, mongoClient_1.connectMongoDB)();
        app.listen(port, () => {
            logger_1.default.info(`[server]: Running at http://localhost:${port}`);
            logger_1.default.info(`[swagger]: Docs available at http://localhost:${port}/api-docs`);
            // WhatsApp is initialized AFTER the HTTP server is up so that the
            // /api/whatsapp/status endpoint (Sprint 14) is already reachable when
            // the QR code is generated. Failure here is non-fatal.
            WhatsAppService_1.default.initialize().catch((err) => {
                logger_1.default.error(`[whatsapp]: Failed to initialize: ${err.message}`, { stack: err.stack });
            });
            // Listen for message receipts (Sprint 36)
            WhatsAppService_1.default.on('message:status', async ({ messageId, status }) => {
                await FeedHistoryService_1.default.updateStatusByMessageId(messageId, status);
                logger_1.default.info(`[whatsapp-webhook]: Message ${messageId} status updated to ${status}`);
            });
            // Initialize Data Cleanup CRON jobs (Sprint 39)
            (0, cleanupCron_1.initCronJobs)();
        });
    }
    catch (error) {
        const err = error;
        logger_1.default.error(`[startup]: Unable to start the server: ${err.message}`, { stack: err.stack });
        process.exit(1);
    }
}
if (require.main === module) {
    startServer();
}
