"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const AuthService_1 = __importDefault(require("../services/AuthService"));
const UserService_1 = __importDefault(require("../services/UserService"));
const ApiResponse_1 = require("../utils/ApiResponse");
/**
 * Handles HTTP transport for authentication flows.
 * Delegates all business logic to AuthService.
 */
class AuthController {
    /**
     * POST /api/auth/register
     * Registers a new administrator account.
     */
    async register(req, res, next) {
        try {
            const { name, email, password } = req.body;
            if (!name || !email || !password) {
                res.status(400).json({ success: false, error: 'name, email and password are required.' });
                return;
            }
            const result = await AuthService_1.default.register({ name, email, password });
            ApiResponse_1.ApiResponse.success(res, result, 'Registration successful.', 201);
        }
        catch (err) {
            next(err);
        }
    }
    /**
     * POST /api/auth/login
     * Authenticates a user and returns a signed JWT.
     */
    async login(req, res, next) {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                res.status(400).json({ success: false, error: 'email and password are required.' });
                return;
            }
            const result = await AuthService_1.default.login({ email, password });
            ApiResponse_1.ApiResponse.success(res, result, 'Login successful.');
        }
        catch (err) {
            next(err);
        }
    }
    /**
     * GET /api/auth/me
     * Returns the profile of the currently authenticated user.
     * Requires a valid Bearer token (authMiddleware).
     */
    async me(req, res, next) {
        try {
            const userId = req.user.userId;
            const user = await UserService_1.default.findById(userId);
            ApiResponse_1.ApiResponse.success(res, user, 'User profile retrieved.');
        }
        catch (err) {
            next(err);
        }
    }
}
exports.AuthController = AuthController;
exports.default = new AuthController();
