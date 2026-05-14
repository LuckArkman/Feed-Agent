"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WhatsAppController = void 0;
const WhatsAppService_1 = __importDefault(require("../services/WhatsAppService"));
const ApiResponse_1 = require("../utils/ApiResponse");
const AppError_1 = require("../utils/AppError");
const logger_1 = __importDefault(require("../utils/logger"));
// SSE heartbeat interval (keep connection alive through proxies/load-balancers)
const SSE_HEARTBEAT_MS = 25_000;
/**
 * Handles HTTP endpoints for WhatsApp connection management.
 */
class WhatsAppController {
    /**
     * GET /api/whatsapp/status
     * Returns the current WhatsApp connection state as a JSON snapshot.
     * Used by the dashboard for lightweight polling (e.g. every 5s after QR scan).
     */
    async getStatus(req, res, next) {
        try {
            const status = WhatsAppService_1.default.getStatus();
            ApiResponse_1.ApiResponse.success(res, status, 'WhatsApp status retrieved.');
        }
        catch (err) {
            next(err);
        }
    }
    /**
     * GET /api/whatsapp/qr/stream
     * Opens a Server-Sent Events (SSE) stream.
     *
     * Event types pushed to the client:
     *  - `qr`          — new QR Code ready  { qrCode: "<base64 PNG>" }
     *  - `connected`   — device scanned and session established
     *  - `disconnected`— connection dropped  { reason: <number | null> }
     *  - `qr:timeout`  — QR expired without scan
     *  - `heartbeat`   — keepalive ping every 25s
     *
     * The client should use the native `EventSource` API with the JWT token
     * passed as a query param: `/api/whatsapp/qr/stream?token=<jwt>`
     */
    streamQr(req, res) {
        // ── Set SSE headers ───────────────────────────────────────────────────
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache, no-transform');
        res.setHeader('Connection', 'keep-alive');
        res.setHeader('X-Accel-Buffering', 'no'); // Disable Nginx buffering
        res.flushHeaders();
        logger_1.default.info(`[whatsapp/sse]: New SSE client connected from ${req.ip}`);
        // ── Helper to push typed SSE events ──────────────────────────────────
        const pushEvent = (event, data = null) => {
            res.write(`event: ${event}\n`);
            res.write(`data: ${JSON.stringify(data ?? {})}\n\n`);
        };
        // ── Send the current status immediately so the client doesn't wait ────
        const current = WhatsAppService_1.default.getStatus();
        if (current.qrCode) {
            pushEvent('qr', { qrCode: current.qrCode });
        }
        else {
            pushEvent(current.state === 'open' ? 'connected' : 'disconnected', { state: current.state });
        }
        // ── Register event handlers ───────────────────────────────────────────
        const onQr = (qrCode) => pushEvent('qr', { qrCode });
        const onOpen = () => pushEvent('connected', null);
        const onClose = (reason) => pushEvent('disconnected', { reason: reason ?? null });
        const onQrTimeout = () => pushEvent('qr:timeout', null);
        WhatsAppService_1.default.on('wa:qr', onQr);
        WhatsAppService_1.default.on('wa:open', onOpen);
        WhatsAppService_1.default.on('wa:close', onClose);
        WhatsAppService_1.default.on('wa:qr:timeout', onQrTimeout);
        // ── Heartbeat — keeps connection alive through proxies ────────────────
        const heartbeat = setInterval(() => {
            pushEvent('heartbeat', { ts: new Date().toISOString() });
        }, SSE_HEARTBEAT_MS);
        // ── Cleanup when the client disconnects ───────────────────────────────
        req.on('close', () => {
            logger_1.default.info(`[whatsapp/sse]: SSE client disconnected from ${req.ip}`);
            clearInterval(heartbeat);
            WhatsAppService_1.default.off('wa:qr', onQr);
            WhatsAppService_1.default.off('wa:open', onOpen);
            WhatsAppService_1.default.off('wa:close', onClose);
            WhatsAppService_1.default.off('wa:qr:timeout', onQrTimeout);
        });
    }
    /**
     * POST /api/whatsapp/test-message
     * Endpoint strictly for administrators to test the WhatsApp connection.
     * Sends a simple text payload to the provided phone number.
     */
    async sendTestMessage(req, res, next) {
        try {
            const { phoneNumber, message } = req.body;
            if (!phoneNumber || !message) {
                throw new AppError_1.AppError('phoneNumber and message are required in the body.', 400);
            }
            await WhatsAppService_1.default.sendMessage(phoneNumber, message);
            ApiResponse_1.ApiResponse.success(res, null, 'Test message queued for sending.');
        }
        catch (err) {
            next(err);
        }
    }
}
exports.WhatsAppController = WhatsAppController;
exports.default = new WhatsAppController();
