"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const prismaClient_1 = __importDefault(require("../models/prismaClient"));
const AppError_1 = require("../utils/AppError");
// ─────────────────────────────────────────────────────────────────────────────
// UserService
// ─────────────────────────────────────────────────────────────────────────────
/**
 * Pure data-access service for the User entity.
 * Does NOT handle business logic such as hashing or token generation —
 * those concerns belong to AuthService.
 */
class UserService {
    /**
     * Persists a new administrator user.
     * Throws AppError (409) if the e-mail is already registered.
     *
     * @param dto - Pre-validated user data (password must already be hashed).
     * @returns The newly created User record, with passwordHash omitted.
     */
    async create(dto) {
        const existing = await prismaClient_1.default.user.findUnique({ where: { email: dto.email } });
        if (existing) {
            throw new AppError_1.AppError('E-mail already registered.', 409);
        }
        const user = await prismaClient_1.default.user.create({
            data: {
                name: dto.name,
                email: dto.email,
                passwordHash: dto.passwordHash,
            },
        });
        const { passwordHash: _omitted, ...safeUser } = user;
        return safeUser;
    }
    /**
     * Finds a user by their e-mail, including the hashed password.
     * Intended exclusively for authentication flows.
     *
     * @param email - The e-mail address to look up.
     * @returns The full User record, or null if not found.
     */
    async findByEmail(email) {
        return prismaClient_1.default.user.findUnique({ where: { email } });
    }
    /**
     * Finds a user by their primary key ID.
     * Throws AppError (404) if not found.
     *
     * @param id - The user's numeric primary key.
     * @returns The User record with passwordHash omitted.
     */
    async findById(id) {
        const user = await prismaClient_1.default.user.findUnique({ where: { id } });
        if (!user) {
            throw new AppError_1.AppError('User not found.', 404);
        }
        const { passwordHash: _omitted, ...safeUser } = user;
        return safeUser;
    }
}
exports.UserService = UserService;
exports.default = new UserService();
