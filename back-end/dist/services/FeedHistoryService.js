"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeedHistoryService = void 0;
const FeedHistory_1 = require("../models/FeedHistory");
const logger_1 = __importDefault(require("../utils/logger"));
class FeedHistoryService {
    /**
     * Logs a message attempt to the history.
     */
    async logMessage(data) {
        try {
            const historyRecord = new FeedHistory_1.FeedHistory(data);
            return await historyRecord.save();
        }
        catch (error) {
            logger_1.default.error(`[feed-history-service]: Failed to log message for contact ${data.contactNumber}: ${error.message}`);
            throw error;
        }
    }
    /**
     * Updates the status of an existing message log.
     */
    async updateMessageStatus(logId, status, errorDetails, messageId) {
        try {
            await FeedHistory_1.FeedHistory.findByIdAndUpdate(logId, {
                $set: {
                    status,
                    ...(errorDetails ? { errorDetails } : {}),
                    ...(messageId ? { messageId } : {})
                }
            }).exec();
        }
        catch (error) {
            logger_1.default.error(`[feed-history-service]: Failed to update message status for log ${logId}: ${error.message}`);
            // non-fatal, shouldn't crash the worker
        }
    }
    /**
     * Updates the status of a log by its messageId (useful for async webhooks/receipts)
     */
    async updateStatusByMessageId(messageId, status) {
        try {
            // Only upgrade status (e.g. sent -> delivered -> read)
            // Since it's linear: 'sent' -> 'delivered' -> 'read', we don't want to downgrade.
            await FeedHistory_1.FeedHistory.findOneAndUpdate({ messageId }, { $set: { status } }).exec();
        }
        catch (error) {
            logger_1.default.error(`[feed-history-service]: Failed to update by messageId ${messageId}: ${error.message}`);
        }
    }
    /**
     * Retrieves the broadcast history for a specific user, paginated.
     */
    async getUserHistory(userId, page = 1, limit = 20) {
        const skip = (page - 1) * limit;
        // Leverage the indexes created on userId and timestamp
        const [data, total] = await Promise.all([
            FeedHistory_1.FeedHistory.find({ userId })
                .sort({ timestamp: -1 })
                .skip(skip)
                .limit(limit)
                .exec(),
            FeedHistory_1.FeedHistory.countDocuments({ userId }).exec()
        ]);
        return {
            data,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit)
        };
    }
    /**
     * Generates Daily KPIs using MongoDB Aggregation Pipeline.
     * Returns total sent today and success rate.
     */
    async getDailyKPIs(userId) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const pipeline = [
            {
                $match: {
                    userId,
                    timestamp: { $gte: today }
                }
            },
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 }
                }
            }
        ];
        const results = await FeedHistory_1.FeedHistory.aggregate(pipeline).exec();
        let totalSent = 0;
        let totalFailed = 0;
        results.forEach(item => {
            if (item._id === 'sent' || item._id === 'delivered' || item._id === 'read') {
                totalSent += item.count;
            }
            else if (item._id === 'failed') {
                totalFailed += item.count;
            }
        });
        const totalProcessed = totalSent + totalFailed;
        const successRate = totalProcessed === 0 ? 0 : Number(((totalSent / totalProcessed) * 100).toFixed(2));
        return {
            totalReachedToday: totalSent,
            successRateToday: successRate
        };
    }
}
exports.FeedHistoryService = FeedHistoryService;
exports.default = new FeedHistoryService();
