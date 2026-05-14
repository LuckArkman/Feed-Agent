"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContactService = void 0;
const prismaClient_1 = __importDefault(require("../models/prismaClient"));
const AppError_1 = require("../utils/AppError");
const phoneUtils_1 = require("../utils/phoneUtils");
// ─────────────────────────────────────────────────────────────────────────────
// ContactService
// ─────────────────────────────────────────────────────────────────────────────
/**
 * Data-access service for the Contact entity.
 * Enforces tenant isolation: every mutating method validates that the
 * contact belongs to the requesting userId before executing.
 */
class ContactService {
    /**
     * Creates a new contact for a user.
     * Sanitizes the phone number to E.164 format before persisting.
     * Throws AppError (409) if the number is already registered for that user.
     *
     * @param dto - Payload containing userId, phoneNumber (raw), and name.
     * @returns The newly created Contact record.
     */
    async create(dto) {
        let sanitized;
        try {
            sanitized = (0, phoneUtils_1.sanitizePhoneNumber)(dto.phoneNumber);
        }
        catch (e) {
            throw new AppError_1.AppError(e.message, 400);
        }
        const existing = await prismaClient_1.default.contact.findUnique({
            where: {
                userId_phoneNumber: { userId: dto.userId, phoneNumber: sanitized },
            },
        });
        if (existing) {
            throw new AppError_1.AppError('This phone number is already registered for this account.', 409);
        }
        return prismaClient_1.default.contact.create({
            data: { userId: dto.userId, phoneNumber: sanitized, name: dto.name },
        });
    }
    /**
     * Returns a paginated list of contacts owned by a specific user.
     *
     * @param userId     - The owner user's ID.
     * @param pagination - Page number (1-indexed) and items per page.
     * @param onlyActive - If true, returns only contacts with active = true.
     * @returns Paginated result wrapping Contact records.
     */
    async findAllByUser(userId, pagination = { page: 1, limit: 20 }, onlyActive = false) {
        const { page, limit } = pagination;
        const skip = (page - 1) * limit;
        const where = { userId, ...(onlyActive ? { active: true } : {}) };
        const [data, total] = await prismaClient_1.default.$transaction([
            prismaClient_1.default.contact.findMany({ where, skip, take: limit, orderBy: { createdAt: 'desc' } }),
            prismaClient_1.default.contact.count({ where }),
        ]);
        return {
            data,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }
    /**
     * Finds a single contact by ID, validating ownership.
     * Throws AppError (404) if not found or if userId does not match.
     */
    async findOneByUser(id, userId) {
        const contact = await prismaClient_1.default.contact.findFirst({ where: { id, userId } });
        if (!contact)
            throw new AppError_1.AppError('Contact not found.', 404);
        return contact;
    }
    /**
     * Updates a contact's name and/or active status.
     * Validates ownership before updating.
     */
    async update(id, userId, dto) {
        await this.findOneByUser(id, userId);
        return prismaClient_1.default.contact.update({ where: { id }, data: dto });
    }
    /**
     * Deletes a contact by ID.
     * Validates ownership before deleting.
     */
    async remove(id, userId) {
        await this.findOneByUser(id, userId);
        await prismaClient_1.default.contact.delete({ where: { id } });
    }
    /**
     * Imports multiple contacts in bulk from a parsed CSV payload.
     * Skips duplicates silently; collects validation errors per row without
     * aborting the entire import (partial success pattern).
     *
     * @param userId - The owner user's ID.
     * @param rows   - Array of { name, phoneNumber } objects from the CSV parser.
     * @returns Summary of imported, skipped, and errored rows.
     */
    async bulkCreate(userId, rows) {
        const result = { imported: 0, skipped: 0, errors: [] };
        for (let i = 0; i < rows.length; i++) {
            const row = rows[i];
            let sanitized;
            // Validate phone number format
            try {
                sanitized = (0, phoneUtils_1.sanitizePhoneNumber)(row.phoneNumber);
            }
            catch (e) {
                result.errors.push({ row: i + 2, phoneNumber: row.phoneNumber, reason: e.message });
                continue;
            }
            // Check for duplicates silently
            const existing = await prismaClient_1.default.contact.findUnique({
                where: { userId_phoneNumber: { userId, phoneNumber: sanitized } },
            });
            if (existing) {
                result.skipped++;
                continue;
            }
            await prismaClient_1.default.contact.create({
                data: { userId, phoneNumber: sanitized, name: row.name },
            });
            result.imported++;
        }
        return result;
    }
}
exports.ContactService = ContactService;
exports.default = new ContactService();
