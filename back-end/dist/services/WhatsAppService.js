"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WhatsAppService = void 0;
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const events_1 = require("events");
const baileys_1 = __importStar(require("@whiskeysockets/baileys"));
const boom_1 = require("@hapi/boom");
const qrcode_1 = __importDefault(require("qrcode"));
const logger_1 = __importDefault(require("../utils/logger"));
const whatsapp_types_1 = require("../types/whatsapp.types");
const phoneUtils_1 = require("../utils/phoneUtils");
const baileys_2 = require("@whiskeysockets/baileys");
// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────
const SESSIONS_DIR = path_1.default.resolve(process.cwd(), 'sessions');
const QR_TIMEOUT_MS = 60_000; // 60 seconds before a new QR cycle is triggered
// ─────────────────────────────────────────────────────────────────────────────
// WhatsAppService — Singleton
// ─────────────────────────────────────────────────────────────────────────────
/**
 * Manages the lifecycle of a single Baileys WebSocket connection.
 * Extends EventEmitter to broadcast connection events to SSE listeners.
 *
 * Usage:
 *   await whatsAppService.initialize();
 *   whatsAppService.on('wa:qr', (qrBase64) => { ... });
 */
class WhatsAppService extends events_1.EventEmitter {
    socket = null;
    qrTimeoutRef = null;
    reconnectTimeoutRef = null;
    status = {
        state: whatsapp_types_1.WaConnectionState.CLOSE,
        lastUpdated: new Date(),
    };
    constructor() {
        super();
        // Avoid Node.js MaxListenersExceededWarning for many SSE clients
        this.setMaxListeners(50);
    }
    // ─── Public API ───────────────────────────────────────────────────────────
    /**
     * Initializes (or re-initializes) the Baileys WebSocket connection.
     * Loads existing session from disk. If no session exists, a QR Code is
     * generated, emitted via `wa:qr` event, and available in `getStatus()`.
     */
    async initialize() {
        if (!fs_1.default.existsSync(SESSIONS_DIR)) {
            fs_1.default.mkdirSync(SESSIONS_DIR, { recursive: true });
        }
        const { version } = await (0, baileys_1.fetchLatestBaileysVersion)();
        logger_1.default.info(`[whatsapp]: Using Baileys v${version.join('.')}`);
        const { state: authState, saveCreds } = await (0, baileys_1.useMultiFileAuthState)(SESSIONS_DIR);
        this.socket = (0, baileys_1.default)({
            version,
            auth: authState,
            logger: { level: 'silent' },
            printQRInTerminal: false,
        });
        this._registerEventListeners(saveCreds);
        logger_1.default.info('[whatsapp]: WhatsApp socket initialized.');
    }
    /**
     * Returns an immutable snapshot of the current connection status.
     * `status.qrCode` is populated only while awaiting a QR scan.
     */
    getStatus() {
        return { ...this.status };
    }
    /**
     * Returns the raw Baileys socket, or null if not initialized.
     * Used by message-sending methods in Sprint 15.
     */
    getSocket() {
        return this.socket;
    }
    /**
     * Sends a text message to a specific phone number.
     * Handles sanitization, JID formatting, artificial delays, and simulated typing.
     *
     * @param phoneNumber - The recipient's raw or sanitized phone number.
     * @param text        - The text message content to send.
     * @param delayMs     - Optional artificial delay before sending (default: 1500ms).
     */
    async sendMessage(phoneNumber, text, delayMs = 1500, imagePath) {
        if (!this.socket || this.status.state !== whatsapp_types_1.WaConnectionState.OPEN) {
            throw new boom_1.Boom('WhatsApp is not connected.', { statusCode: 503 });
        }
        // 1. Sanitize and format the number to Baileys JID format
        const sanitized = (0, phoneUtils_1.sanitizePhoneNumber)(phoneNumber);
        const jid = (0, phoneUtils_1.toWhatsAppJid)(sanitized);
        // 2. Simulate typing presence to make it feel human
        await this.socket.presenceSubscribe(jid);
        await (0, baileys_2.delay)(500);
        await this.socket.sendPresenceUpdate('composing', jid);
        // 3. Artificial delay (configurable, helps prevent spam detection)
        await (0, baileys_2.delay)(delayMs);
        // 4. Send the actual message (with optional image) and clear typing status
        await this.socket.sendPresenceUpdate('paused', jid);
        let sentMsg;
        if (imagePath && fs_1.default.existsSync(imagePath)) {
            sentMsg = await this.socket.sendMessage(jid, {
                image: fs_1.default.readFileSync(imagePath),
                caption: text
            });
        }
        else {
            sentMsg = await this.socket.sendMessage(jid, { text });
        }
        logger_1.default.info(`[whatsapp]: Message sent successfully to ${jid}`);
        return sentMsg?.key?.id || '';
    }
    // ─── Private Helpers ──────────────────────────────────────────────────────
    /**
     * Registers all Baileys event listeners on the active socket instance.
     *
     * @param saveCreds - Persistence callback from `useMultiFileAuthState`.
     */
    _registerEventListeners(saveCreds) {
        if (!this.socket)
            return;
        // Persist credentials on every update
        this.socket.ev.on('creds.update', async () => {
            await saveCreds();
            logger_1.default.info('[whatsapp]: Credentials saved to disk.');
        });
        // Handle all connection state transitions
        this.socket.ev.on('connection.update', async (update) => {
            const { connection, lastDisconnect, qr } = update;
            // ── New QR Code — encode + emit + start expiry timer ───────────────
            if (qr) {
                this._clearQrTimeout();
                logger_1.default.info('[whatsapp]: New QR Code generated. Waiting for scan...');
                let qrBase64;
                try {
                    qrBase64 = await qrcode_1.default.toDataURL(qr);
                }
                catch {
                    logger_1.default.warn('[whatsapp]: QR encoding failed.');
                    qrBase64 = '';
                }
                this._updateStatus(whatsapp_types_1.WaConnectionState.CONNECTING, qrBase64);
                this.emit('wa:qr', qrBase64);
                // If not scanned within timeout, trigger a fresh cycle
                this.qrTimeoutRef = setTimeout(() => {
                    logger_1.default.warn('[whatsapp]: QR Code expired. Restarting connection...');
                    this.emit('wa:qr:timeout');
                    this._closeSocket();
                    this.initialize().catch(() => { });
                }, QR_TIMEOUT_MS);
            }
            // ── Connecting ──────────────────────────────────────────────────────
            if (connection === 'connecting') {
                logger_1.default.info('[whatsapp]: Connecting to WhatsApp...');
                this._updateStatus(whatsapp_types_1.WaConnectionState.CONNECTING);
            }
            // ── Open (authenticated) ────────────────────────────────────────────
            if (connection === 'open') {
                this._clearQrTimeout();
                logger_1.default.info('[whatsapp]: Connection established!');
                this._updateStatus(whatsapp_types_1.WaConnectionState.OPEN);
                this.emit('wa:open');
            }
            // ── Closed ─────────────────────────────────────────────────────────
            if (connection === 'close') {
                this._clearQrTimeout();
                const reason = lastDisconnect?.error?.output?.statusCode;
                const isLoggedOut = reason === baileys_1.DisconnectReason.loggedOut;
                const isBanned = reason === 403; // 403 Forbidden is typically returned for banned/blocked numbers
                const shouldReconnect = !isLoggedOut && !isBanned;
                this._updateStatus(whatsapp_types_1.WaConnectionState.CLOSE);
                if (isBanned) {
                    logger_1.default.error(`[whatsapp]: 🚨 CRITICAL ALERT: WhatsApp account has been BANNED or FORBIDDEN (Code: 403).`);
                    this.emit('wa:close', reason);
                    this._clearSession();
                }
                else if (isLoggedOut) {
                    logger_1.default.warn('[whatsapp]: Logged out from device. Clearing session files...');
                    this.emit('wa:close', reason);
                    this._clearSession();
                }
                else {
                    logger_1.default.warn(`[whatsapp]: Connection closed. Reason code: ${reason}. Reconnecting in 5s...`);
                    this.emit('wa:close', reason);
                    if (this.reconnectTimeoutRef) {
                        clearTimeout(this.reconnectTimeoutRef);
                    }
                    this.reconnectTimeoutRef = setTimeout(() => {
                        this.reconnectTimeoutRef = null;
                        this.initialize().catch(() => { });
                    }, 5_000);
                }
            }
        });
        // Handle message receipts (delivered / read)
        this.socket.ev.on('messages.update', async (updates) => {
            for (const update of updates) {
                if (update.update.status) {
                    const messageId = update.key.id;
                    const statusInt = update.update.status;
                    let strStatus = null;
                    // Baileys status codes: 3 = SERVER_ACK/DELIVERY_ACK, 4 = READ
                    if (statusInt === 3)
                        strStatus = 'delivered';
                    if (statusInt === 4)
                        strStatus = 'read';
                    if (messageId && strStatus) {
                        this.emit('message:status', { messageId, status: strStatus });
                    }
                }
            }
        });
    }
    /**
     * Updates the internal status snapshot.
     * Clears `qrCode` once the state is OPEN to free memory.
     */
    _updateStatus(state, qrCode) {
        this.status = {
            state,
            qrCode: state === whatsapp_types_1.WaConnectionState.OPEN ? undefined : qrCode,
            lastUpdated: new Date(),
        };
    }
    /** Cancels any pending QR expiry timer. */
    _clearQrTimeout() {
        if (this.qrTimeoutRef) {
            clearTimeout(this.qrTimeoutRef);
            this.qrTimeoutRef = null;
        }
    }
    /** Destroys the active socket, triggering a 'close' event. */
    _closeSocket() {
        if (this.reconnectTimeoutRef) {
            clearTimeout(this.reconnectTimeoutRef);
            this.reconnectTimeoutRef = null;
        }
        if (this.socket) {
            this.socket.end(undefined);
            this.socket = null;
        }
    }
    /** Removes all session files, forcing a fresh QR scan on next initialize(). */
    _clearSession() {
        if (fs_1.default.existsSync(SESSIONS_DIR)) {
            fs_1.default.rmSync(SESSIONS_DIR, { recursive: true, force: true });
            logger_1.default.info('[whatsapp]: Session directory cleared.');
        }
    }
}
exports.WhatsAppService = WhatsAppService;
exports.default = new WhatsAppService();
