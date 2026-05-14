"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsController = void 0;
const ApiResponse_1 = require("../utils/ApiResponse");
const FeedHistoryService_1 = __importDefault(require("../services/FeedHistoryService"));
const AppError_1 = require("../utils/AppError");
class AnalyticsController {
    /**
     * GET /api/analytics/history
     * Retrieves paginated broadcast history for the dashboard.
     */
    async getHistory(req, res, next) {
        try {
            const userId = req.user.userId;
            const page = parseInt(req.query.page, 10) || 1;
            const limit = parseInt(req.query.limit, 10) || 20;
            if (page < 1 || limit < 1) {
                throw new AppError_1.AppError('Page and limit must be greater than 0', 400);
            }
            const history = await FeedHistoryService_1.default.getUserHistory(userId, page, limit);
            ApiResponse_1.ApiResponse.success(res, history, 'History retrieved successfully.', 200);
        }
        catch (err) {
            next(err);
        }
    }
    /**
     * GET /api/analytics/kpi
     * Retrieves daily KPIs (Total reached, success rate).
     */
    async getDailyKPIs(req, res, next) {
        try {
            const userId = req.user.userId;
            const kpis = await FeedHistoryService_1.default.getDailyKPIs(userId);
            ApiResponse_1.ApiResponse.success(res, kpis, 'KPIs retrieved successfully.', 200);
        }
        catch (err) {
            next(err);
        }
    }
}
exports.AnalyticsController = AnalyticsController;
exports.default = new AnalyticsController();
