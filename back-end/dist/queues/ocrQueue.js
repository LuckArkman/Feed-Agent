"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ocrWorker = exports.ocrQueue = exports.OCR_QUEUE_NAME = void 0;
const bullmq_1 = require("bullmq");
const fs_1 = __importDefault(require("fs"));
const OcrService_1 = __importDefault(require("../services/OcrService"));
const NewsGeneratorService_1 = __importDefault(require("../services/NewsGeneratorService"));
const DraftService_1 = __importDefault(require("../services/DraftService"));
const logger_1 = __importDefault(require("../utils/logger"));
const redisClient_1 = __importDefault(require("../utils/redisClient"));
// ─────────────────────────────────────────────────────────────────────────────
// OCR Queue Setup
// ─────────────────────────────────────────────────────────────────────────────
exports.OCR_QUEUE_NAME = 'ocr-processing-queue';
exports.ocrQueue = new bullmq_1.Queue(exports.OCR_QUEUE_NAME, {
    connection: redisClient_1.default,
    defaultJobOptions: {
        attempts: 3,
        backoff: {
            type: 'exponential',
            delay: 2000,
        },
        removeOnComplete: 100,
        removeOnFail: 200,
    },
});
// ─────────────────────────────────────────────────────────────────────────────
// OCR Worker Definition
// ─────────────────────────────────────────────────────────────────────────────
exports.ocrWorker = new bullmq_1.Worker(exports.OCR_QUEUE_NAME, async (job) => {
    const { filePath, mimetype, originalName } = job.data;
    logger_1.default.info(`[ocr-worker]: Started processing job ${job.id} for file ${originalName}`);
    try {
        // 1. Report initial progress
        await job.updateProgress(10);
        // 2. Perform OCR
        const { text, confidence } = await OcrService_1.default.extractText(filePath, mimetype);
        await job.updateProgress(50); // OCR done, AI starting
        // 3. Generate JSON via Llama
        const articleJson = await NewsGeneratorService_1.default.generateNewsFromOcr(text);
        await job.updateProgress(80);
        // 4. Save draft to Database (include imagePath)
        const draft = await DraftService_1.default.createDraft(job.data.userId, text, articleJson, filePath);
        await job.updateProgress(90);
        // Note: We do not unlink the file on success. The file will be kept for WhatsApp media attachment,
        // and cleaned up by the daily cron job after 24h.
        await job.updateProgress(100);
        logger_1.default.info(`[ocr-worker]: Completed job ${job.id} successfully. Draft ID: ${draft.id}`);
        return {
            draftId: draft.id,
            originalName,
            confidence,
            article: articleJson,
        };
    }
    catch (error) {
        // Ensure cleanup even on failure
        if (fs_1.default.existsSync(filePath)) {
            fs_1.default.unlinkSync(filePath);
        }
        logger_1.default.error(`[ocr-worker]: Job ${job.id} failed: ${error.message}`);
        throw error;
    }
}, {
    connection: redisClient_1.default,
    concurrency: 2, // Process up to 2 images concurrently
});
exports.ocrWorker.on('failed', (job, err) => {
    logger_1.default.error(`[ocr-worker]: Job ${job?.id} permanently failed: ${err.message}`);
});
