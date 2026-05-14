"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initCronJobs = void 0;
const node_cron_1 = __importDefault(require("node-cron"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const logger_1 = __importDefault(require("../utils/logger"));
const prismaClient_1 = __importDefault(require("../models/prismaClient"));
const client_1 = require("@prisma/client");
const UPLOADS_DIR = path_1.default.resolve(process.cwd(), 'uploads');
const initCronJobs = () => {
    // 1. Clean up temporary images from disk
    // Runs every day at 03:00 AM ('0 3 * * *')
    node_cron_1.default.schedule('0 3 * * *', () => {
        logger_1.default.info('[cron]: Starting daily upload directory cleanup...');
        try {
            if (fs_1.default.existsSync(UPLOADS_DIR)) {
                const files = fs_1.default.readdirSync(UPLOADS_DIR);
                const now = Date.now();
                // Assume files older than 24 hours are safe to delete
                const ONE_DAY_MS = 24 * 60 * 60 * 1000;
                let deletedCount = 0;
                for (const file of files) {
                    const filePath = path_1.default.join(UPLOADS_DIR, file);
                    const stats = fs_1.default.statSync(filePath);
                    if (now - stats.mtimeMs > ONE_DAY_MS) {
                        fs_1.default.unlinkSync(filePath);
                        deletedCount++;
                    }
                }
                logger_1.default.info(`[cron]: Upload cleanup finished. Deleted ${deletedCount} old files.`);
            }
        }
        catch (error) {
            logger_1.default.error(`[cron]: Failed to clean uploads directory: ${error.message}`);
        }
    });
    // 2. Clean up old rejected/pending drafts from PostgreSQL
    // Runs every day at 03:30 AM ('30 3 * * *')
    node_cron_1.default.schedule('30 3 * * *', async () => {
        logger_1.default.info('[cron]: Starting daily PostgreSQL drafts cleanup...');
        try {
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
            const result = await prismaClient_1.default.draft.deleteMany({
                where: {
                    status: {
                        in: [client_1.DraftStatus.REJECTED, client_1.DraftStatus.PENDING, client_1.DraftStatus.CANCELLED]
                    },
                    createdAt: {
                        lt: thirtyDaysAgo
                    }
                }
            });
            logger_1.default.info(`[cron]: Draft cleanup finished. Deleted ${result.count} old drafts.`);
        }
        catch (error) {
            logger_1.default.error(`[cron]: Failed to clean PostgreSQL drafts: ${error.message}`);
        }
    });
    logger_1.default.info('[cron]: Registered all cron jobs.');
};
exports.initCronJobs = initCronJobs;
