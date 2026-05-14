"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContactController = exports.csvUpload = void 0;
const multer_1 = __importDefault(require("multer"));
const ContactService_1 = __importDefault(require("../services/ContactService"));
const csvParser_1 = require("../utils/csvParser");
const ApiResponse_1 = require("../utils/ApiResponse");
const AppError_1 = require("../utils/AppError");
// ─────────────────────────────────────────────────────────────────────────────
// Multer configuration — memory storage, CSV only, max 2 MB
// ─────────────────────────────────────────────────────────────────────────────
exports.csvUpload = (0, multer_1.default)({
    storage: multer_1.default.memoryStorage(),
    limits: { fileSize: 2 * 1024 * 1024 },
    fileFilter: (_req, file, cb) => {
        if (file.mimetype === 'text/csv' || file.originalname.endsWith('.csv')) {
            cb(null, true);
        }
        else {
            cb(new AppError_1.AppError('Only .csv files are allowed.', 415), false);
        }
    },
});
// ─────────────────────────────────────────────────────────────────────────────
// ContactController
// ─────────────────────────────────────────────────────────────────────────────
/**
 * Handles HTTP transport for Contact CRUD and bulk-import operations.
 * Every handler extracts `userId` from `req.user` (set by authMiddleware),
 * ensuring strict per-tenant data isolation at the controller level.
 */
class ContactController {
    /**
     * POST /api/contacts
     * Creates a new contact. Validates and sanitizes the phone number.
     */
    async create(req, res, next) {
        try {
            const userId = req.user.userId;
            const { phoneNumber, name } = req.body;
            if (!phoneNumber || !name) {
                return next(new AppError_1.AppError('phoneNumber and name are required.', 400));
            }
            const contact = await ContactService_1.default.create({ userId, phoneNumber, name });
            ApiResponse_1.ApiResponse.success(res, contact, 'Contact created successfully.', 201);
        }
        catch (err) {
            next(err);
        }
    }
    /**
     * GET /api/contacts?page=1&limit=20&onlyActive=true
     * Returns a paginated list of contacts for the authenticated user.
     */
    async findAll(req, res, next) {
        try {
            const userId = req.user.userId;
            const onlyActive = req.query.onlyActive === 'true';
            const page = Math.max(1, parseInt(String(req.query.page || '1'), 10) || 1);
            const limit = Math.min(100, Math.max(1, parseInt(String(req.query.limit || '20'), 10) || 20));
            const result = await ContactService_1.default.findAllByUser(userId, { page, limit }, onlyActive);
            ApiResponse_1.ApiResponse.success(res, result, 'Contacts retrieved successfully.');
        }
        catch (err) {
            next(err);
        }
    }
    /**
     * PUT /api/contacts/:id
     * Updates a contact's name and/or active status.
     */
    async update(req, res, next) {
        try {
            const userId = req.user.userId;
            const id = parseInt(String(req.params.id), 10);
            if (isNaN(id))
                return next(new AppError_1.AppError('Invalid contact ID.', 400));
            const { name, active } = req.body;
            const contact = await ContactService_1.default.update(id, userId, { name, active });
            ApiResponse_1.ApiResponse.success(res, contact, 'Contact updated successfully.');
        }
        catch (err) {
            next(err);
        }
    }
    /**
     * DELETE /api/contacts/:id
     * Permanently removes a contact.
     */
    async remove(req, res, next) {
        try {
            const userId = req.user.userId;
            const id = parseInt(String(req.params.id), 10);
            if (isNaN(id))
                return next(new AppError_1.AppError('Invalid contact ID.', 400));
            await ContactService_1.default.remove(id, userId);
            ApiResponse_1.ApiResponse.success(res, null, 'Contact deleted successfully.');
        }
        catch (err) {
            next(err);
        }
    }
    /**
     * POST /api/contacts/import
     * Accepts a multipart CSV file and bulk-imports contacts.
     * Returns a summary of imported, skipped, and errored rows.
     */
    async importCsv(req, res, next) {
        try {
            const userId = req.user.userId;
            if (!req.file) {
                return next(new AppError_1.AppError('No CSV file uploaded.', 400));
            }
            let rows;
            try {
                rows = (0, csvParser_1.parseCsvContacts)(req.file.buffer);
            }
            catch (e) {
                return next(new AppError_1.AppError(e.message, 422));
            }
            if (rows.length === 0) {
                return next(new AppError_1.AppError('CSV file contains no valid data rows.', 422));
            }
            const summary = await ContactService_1.default.bulkCreate(userId, rows);
            ApiResponse_1.ApiResponse.success(res, summary, 'CSV import completed.', 201);
        }
        catch (err) {
            next(err);
        }
    }
}
exports.ContactController = ContactController;
exports.default = new ContactController();
