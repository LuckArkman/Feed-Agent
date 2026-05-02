import { Router } from 'express';
import analyticsController from '../controllers/AnalyticsController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

// Protect all analytics routes
router.use(authMiddleware);

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
router.get('/history', analyticsController.getHistory.bind(analyticsController));

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
router.get('/kpi', analyticsController.getDailyKPIs.bind(analyticsController));

export default router;
