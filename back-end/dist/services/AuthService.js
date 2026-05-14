"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const UserService_1 = __importDefault(require("./UserService"));
const AppError_1 = require("../utils/AppError");
// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────
const SALT_ROUNDS = 12;
function getJwtSecret() {
    const secret = process.env.JWT_SECRET;
    if (!secret)
        throw new Error('JWT_SECRET environment variable is not defined.');
    return secret;
}
function signToken(payload) {
    const expiresIn = (process.env.JWT_EXPIRES_IN || '7d');
    return jsonwebtoken_1.default.sign(payload, getJwtSecret(), { expiresIn });
}
// ─────────────────────────────────────────────────────────────────────────────
// AuthService
// ─────────────────────────────────────────────────────────────────────────────
/**
 * Handles all authentication business logic:
 * password hashing, credential validation, and JWT lifecycle.
 */
class AuthService {
    /**
     * Registers a new administrator user.
     * Hashes the plain-text password before persisting it.
     *
     * @param dto - Registration payload with name, email, and plain password.
     * @returns A signed JWT and the created user (without passwordHash).
     */
    async register(dto) {
        const passwordHash = await bcrypt_1.default.hash(dto.password, SALT_ROUNDS);
        const user = await UserService_1.default.create({
            name: dto.name,
            email: dto.email,
            passwordHash,
        });
        const token = signToken({ userId: user.id, email: user.email });
        return { token, user };
    }
    /**
     * Authenticates a user by verifying their credentials.
     * Uses constant-time comparison (bcrypt.compare) to prevent timing attacks.
     *
     * @param dto - Login payload with email and plain password.
     * @returns A signed JWT and the authenticated user (without passwordHash).
     * @throws AppError (401) if credentials are invalid.
     */
    async login(dto) {
        const userRecord = await UserService_1.default.findByEmail(dto.email);
        // Deliberate: use the same generic message for both "user not found" and
        // "wrong password" to prevent user enumeration attacks.
        if (!userRecord) {
            throw new AppError_1.AppError('Invalid credentials.', 401);
        }
        const passwordMatch = await bcrypt_1.default.compare(dto.password, userRecord.passwordHash);
        if (!passwordMatch) {
            throw new AppError_1.AppError('Invalid credentials.', 401);
        }
        const { passwordHash: _omitted, ...safeUser } = userRecord;
        const token = signToken({ userId: safeUser.id, email: safeUser.email });
        return { token, user: safeUser };
    }
    /**
     * Verifies a JWT and returns its decoded payload.
     *
     * @param token - The Bearer token string (without the "Bearer " prefix).
     * @returns The decoded AuthPayload.
     * @throws AppError (401) if the token is invalid or expired.
     */
    verifyToken(token) {
        try {
            return jsonwebtoken_1.default.verify(token, getJwtSecret());
        }
        catch {
            throw new AppError_1.AppError('Invalid or expired token.', 401);
        }
    }
}
exports.AuthService = AuthService;
exports.default = new AuthService();
