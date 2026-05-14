"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const AuthService_1 = __importDefault(require("../services/AuthService"));
const AppError_1 = require("../utils/AppError");
/**
 * Middleware that validates a JWT from either:
 *  1. The `Authorization: Bearer <token>` header (standard REST clients), or
 *  2. The `?token=<jwt>` query parameter (required for SSE EventSource streams,
 *     which cannot set custom headers in the browser).
 *
 * Attaches the decoded payload to `req.user` on success.
 * Throws AppError (401) if no valid token is found in either location.
 */
const authMiddleware = (req, res, next) => {
    let token;
    // 1. Try Authorization header first (preferred, most secure)
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.split(' ')[1];
    }
    // 2. Fallback: query param (SSE streams via native EventSource)
    if (!token && req.query.token && typeof req.query.token === 'string') {
        token = req.query.token;
    }
    if (!token) {
        return next(new AppError_1.AppError('Authorization token missing. Provide a Bearer header or ?token= query param.', 401));
    }
    try {
        const payload = AuthService_1.default.verifyToken(token);
        req.user = payload;
        next();
    }
    catch (err) {
        next(err);
    }
};
exports.authMiddleware = authMiddleware;
