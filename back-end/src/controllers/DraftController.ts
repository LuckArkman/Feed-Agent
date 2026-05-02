import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../utils/ApiResponse';
import { AppError } from '../utils/AppError';
import draftService from '../services/DraftService';
import { DraftStatus } from '@prisma/client';

export class DraftController {
  /**
   * GET /api/drafts
   * Lists all drafts for the authenticated user.
   * Can be filtered by status via query param (e.g., ?status=PENDING)
   */
  async getDrafts(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.userId;
      const statusQuery = req.query.status as string | undefined;

      let statusFilter: DraftStatus | undefined;
      
      if (statusQuery) {
        const upperStatus = statusQuery.toUpperCase();
        if (!Object.values(DraftStatus).includes(upperStatus as DraftStatus)) {
          throw new AppError(`Invalid status. Allowed values: ${Object.values(DraftStatus).join(', ')}`, 400);
        }
        statusFilter = upperStatus as DraftStatus;
      }

      const drafts = await draftService.getUserDrafts(userId, statusFilter);
      
      ApiResponse.success(res, drafts, 'Drafts retrieved successfully.', 200);
    } catch (err) {
      next(err);
    }
  }

  /**
   * GET /api/drafts/:id
   * Retrieves specific details of a draft, including the original OCR text.
   */
  async getDraftById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.userId;
      const draftId = parseInt(req.params.id as string, 10);

      if (isNaN(draftId)) {
        throw new AppError('Invalid draft ID provided.', 400);
      }

      const draft = await draftService.getDraftById(draftId, userId);

      if (!draft) {
        throw new AppError('Draft not found or does not belong to user.', 404);
      }

      ApiResponse.success(res, draft, 'Draft details retrieved successfully.', 200);
    } catch (err) {
      next(err);
    }
  }
  /**
   * PUT /api/drafts/:id
   * Updates the generated content (NewsArticleJSON) of a specific draft.
   */
  async updateDraft(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.userId;
      const draftId = parseInt(req.params.id as string, 10);

      if (isNaN(draftId)) {
        throw new AppError('Invalid draft ID provided.', 400);
      }

      if (!req.body || typeof req.body !== 'object') {
        throw new AppError('Invalid request body. Expected a JSON object.', 400);
      }

      const updatedDraft = await draftService.updateDraftContent(draftId, userId, req.body);

      ApiResponse.success(res, updatedDraft, 'Draft updated successfully.', 200);
    } catch (err) {
      next(err);
    }
  }

  /**
   * POST /api/drafts/:id/approve
   * Marks the draft as APPROVED and triggers the broadcast event.
   */
  async approveDraft(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.userId;
      const draftId = parseInt(req.params.id as string, 10);

      if (isNaN(draftId)) {
        throw new AppError('Invalid draft ID provided.', 400);
      }

      // Verify ownership first
      const draft = await draftService.getDraftById(draftId, userId);
      if (!draft) {
        throw new AppError('Draft not found or does not belong to user.', 404);
      }

      const includeImage = req.body.includeImage === true;

      const updatedDraft = await draftService.updateDraftStatus(draftId, DraftStatus.APPROVED);

      // Trigger the broadcast event (will be fully implemented via Queues in Sprint 30)
      await draftService.triggerBroadcastEvent(draftId, userId, includeImage);

      ApiResponse.success(res, updatedDraft, 'Draft approved and queued for broadcasting.', 200);
    } catch (err) {
      next(err);
    }
  }

  /**
   * POST /api/drafts/:id/reject
   * Marks the draft as REJECTED. It will not be sent to contacts.
   */
  async rejectDraft(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.userId;
      const draftId = parseInt(req.params.id as string, 10);

      if (isNaN(draftId)) {
        throw new AppError('Invalid draft ID provided.', 400);
      }

      // Verify ownership first
      const draft = await draftService.getDraftById(draftId, userId);
      if (!draft) {
        throw new AppError('Draft not found or does not belong to user.', 404);
      }

      const updatedDraft = await draftService.updateDraftStatus(draftId, DraftStatus.REJECTED);

      ApiResponse.success(res, updatedDraft, 'Draft rejected successfully.', 200);
    } catch (err) {
      next(err);
    }
  }

  /**
   * POST /api/drafts/:id/cancel
   * Cancels a pending or active broadcast.
   */
  async cancelDraft(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.userId;
      const draftId = parseInt(req.params.id as string, 10);

      if (isNaN(draftId)) {
        throw new AppError('Invalid draft ID provided.', 400);
      }

      const draft = await draftService.getDraftById(draftId, userId);
      if (!draft) {
        throw new AppError('Draft not found or does not belong to user.', 404);
      }

      await draftService.cancelBroadcast(draftId, userId);

      ApiResponse.success(res, null, 'Broadcast cancelled successfully.', 200);
    } catch (err) {
      next(err);
    }
  }
}

export default new DraftController();
