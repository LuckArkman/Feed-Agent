import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../utils/ApiResponse';
import feedHistoryService from '../services/FeedHistoryService';
import { AppError } from '../utils/AppError';

export class AnalyticsController {
  /**
   * GET /api/analytics/history
   * Retrieves paginated broadcast history for the dashboard.
   */
  async getHistory(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.userId;
      
      const page = parseInt(req.query.page as string, 10) || 1;
      const limit = parseInt(req.query.limit as string, 10) || 20;

      if (page < 1 || limit < 1) {
        throw new AppError('Page and limit must be greater than 0', 400);
      }

      const history = await feedHistoryService.getUserHistory(userId, page, limit);

      ApiResponse.success(res, history, 'History retrieved successfully.', 200);
    } catch (err) {
      next(err);
    }
  }

  /**
   * GET /api/analytics/kpi
   * Retrieves daily KPIs (Total reached, success rate).
   */
  async getDailyKPIs(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.userId;

      const kpis = await feedHistoryService.getDailyKPIs(userId);

      ApiResponse.success(res, kpis, 'KPIs retrieved successfully.', 200);
    } catch (err) {
      next(err);
    }
  }
}

export default new AnalyticsController();
