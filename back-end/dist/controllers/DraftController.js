"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DraftController = void 0;
const ApiResponse_1 = require("../utils/ApiResponse");
const AppError_1 = require("../utils/AppError");
const DraftService_1 = __importDefault(require("../services/DraftService"));
const client_1 = require("@prisma/client");
class DraftController {
    /**
     * GET /api/drafts
     * Lists all drafts for the authenticated user.
     * Can be filtered by status via query param (e.g., ?status=PENDING)
     */
    async getDrafts(req, res, next) {
        try {
            const userId = req.user.userId;
            const statusQuery = req.query.status;
            let statusFilter;
            if (statusQuery) {
                const upperStatus = statusQuery.toUpperCase();
                if (!Object.values(client_1.DraftStatus).includes(upperStatus)) {
                    throw new AppError_1.AppError(`Invalid status. Allowed values: ${Object.values(client_1.DraftStatus).join(', ')}`, 400);
                }
                statusFilter = upperStatus;
            }
            const drafts = await DraftService_1.default.getUserDrafts(userId, statusFilter);
            ApiResponse_1.ApiResponse.success(res, drafts, 'Drafts retrieved successfully.', 200);
        }
        catch (err) {
            next(err);
        }
    }
    /**
     * GET /api/drafts/:id
     * Retrieves specific details of a draft, including the original OCR text.
     */
    async getDraftById(req, res, next) {
        try {
            const userId = req.user.userId;
            const draftId = parseInt(req.params.id, 10);
            if (isNaN(draftId)) {
                throw new AppError_1.AppError('Invalid draft ID provided.', 400);
            }
            const draft = await DraftService_1.default.getDraftById(draftId, userId);
            if (!draft) {
                throw new AppError_1.AppError('Draft not found or does not belong to user.', 404);
            }
            ApiResponse_1.ApiResponse.success(res, draft, 'Draft details retrieved successfully.', 200);
        }
        catch (err) {
            next(err);
        }
    }
    /**
     * PUT /api/drafts/:id
     * Updates the generated content (NewsArticleJSON) of a specific draft.
     */
    async updateDraft(req, res, next) {
        try {
            const userId = req.user.userId;
            const draftId = parseInt(req.params.id, 10);
            if (isNaN(draftId)) {
                throw new AppError_1.AppError('Invalid draft ID provided.', 400);
            }
            if (!req.body || typeof req.body !== 'object') {
                throw new AppError_1.AppError('Invalid request body. Expected a JSON object.', 400);
            }
            const updatedDraft = await DraftService_1.default.updateDraftContent(draftId, userId, req.body);
            ApiResponse_1.ApiResponse.success(res, updatedDraft, 'Draft updated successfully.', 200);
        }
        catch (err) {
            next(err);
        }
    }
    /**
     * POST /api/drafts/:id/approve
     * Marks the draft as APPROVED and triggers the broadcast event.
     */
    async approveDraft(req, res, next) {
        try {
            const userId = req.user.userId;
            const draftId = parseInt(req.params.id, 10);
            if (isNaN(draftId)) {
                throw new AppError_1.AppError('Invalid draft ID provided.', 400);
            }
            // Verify ownership first
            const draft = await DraftService_1.default.getDraftById(draftId, userId);
            if (!draft) {
                throw new AppError_1.AppError('Draft not found or does not belong to user.', 404);
            }
            const includeImage = req.body.includeImage === true;
            const updatedDraft = await DraftService_1.default.updateDraftStatus(draftId, client_1.DraftStatus.APPROVED);
            // Trigger the broadcast event (will be fully implemented via Queues in Sprint 30)
            await DraftService_1.default.triggerBroadcastEvent(draftId, userId, includeImage);
            ApiResponse_1.ApiResponse.success(res, updatedDraft, 'Draft approved and queued for broadcasting.', 200);
        }
        catch (err) {
            next(err);
        }
    }
    /**
     * POST /api/drafts/:id/reject
     * Marks the draft as REJECTED. It will not be sent to contacts.
     */
    async rejectDraft(req, res, next) {
        try {
            const userId = req.user.userId;
            const draftId = parseInt(req.params.id, 10);
            if (isNaN(draftId)) {
                throw new AppError_1.AppError('Invalid draft ID provided.', 400);
            }
            // Verify ownership first
            const draft = await DraftService_1.default.getDraftById(draftId, userId);
            if (!draft) {
                throw new AppError_1.AppError('Draft not found or does not belong to user.', 404);
            }
            const updatedDraft = await DraftService_1.default.updateDraftStatus(draftId, client_1.DraftStatus.REJECTED);
            ApiResponse_1.ApiResponse.success(res, updatedDraft, 'Draft rejected successfully.', 200);
        }
        catch (err) {
            next(err);
        }
    }
    /**
     * POST /api/drafts/:id/cancel
     * Cancels a pending or active broadcast.
     */
    async cancelDraft(req, res, next) {
        try {
            const userId = req.user.userId;
            const draftId = parseInt(req.params.id, 10);
            if (isNaN(draftId)) {
                throw new AppError_1.AppError('Invalid draft ID provided.', 400);
            }
            const draft = await DraftService_1.default.getDraftById(draftId, userId);
            if (!draft) {
                throw new AppError_1.AppError('Draft not found or does not belong to user.', 404);
            }
            await DraftService_1.default.cancelBroadcast(draftId, userId);
            ApiResponse_1.ApiResponse.success(res, null, 'Broadcast cancelled successfully.', 200);
        }
        catch (err) {
            next(err);
        }
    }
}
exports.DraftController = DraftController;
exports.default = new DraftController();
