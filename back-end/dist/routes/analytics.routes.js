"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const AnalyticsController_1 = __importDefault(require("../controllers/AnalyticsController"));
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = (0, express_1.Router)();
// Protect all analytics routes
router.use(authMiddleware_1.authMiddleware);
/**
 * @openapi
 * /api/analytics/history:
 *   get:
 *     summary: Get message broadcast history
 *     description: Retrieves the paginated MongoDB history of sent/failed messages for the authenticated user.
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: The page number to retrieve.
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *         description: Number of records per page.
 *     responses:
 *       200:
 *         description: Paginated history retrieved successfully.
 *       400:
 *         description: Invalid pagination parameters.
 *       401:
 *         description: Unauthorized.
 */
router.get('/history', AnalyticsController_1.default.getHistory.bind(AnalyticsController_1.default));
/**
 * @openapi
 * /api/analytics/kpi:
 *   get:
 *     summary: Get daily KPIs
 *     description: Retrieves aggregated metrics for today's broadcasts (e.g., total reached, success rate).
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: KPIs retrieved successfully.
 *       401:
 *         description: Unauthorized.
 */
router.get('/kpi', AnalyticsController_1.default.getDailyKPIs.bind(AnalyticsController_1.default));
exports.default = router;
