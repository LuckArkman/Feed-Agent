"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const AuthController_1 = __importDefault(require("../controllers/AuthController"));
const authMiddleware_1 = require("../middlewares/authMiddleware");
const rateLimiter_1 = require("../middlewares/rateLimiter");
const router = (0, express_1.Router)();
/**
 * @openapi
 * /api/auth/register:
 *   post:
 *     summary: Register a new administrator
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, password]
 *             properties:
 *               name:     { type: string, example: "João Admin" }
 *               email:    { type: string, example: "admin@feedagent.io" }
 *               password: { type: string, example: "Str0ng@Pass!" }
 *     responses:
 *       201:
 *         description: Registration successful — returns JWT and user profile.
 *       409:
 *         description: E-mail already registered.
 */
router.post('/register', rateLimiter_1.authLimiter, AuthController_1.default.register.bind(AuthController_1.default));
/**
 * @openapi
 * /api/auth/login:
 *   post:
 *     summary: Authenticate and receive a JWT
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:    { type: string, example: "admin@feedagent.io" }
 *               password: { type: string, example: "Str0ng@Pass!" }
 *     responses:
 *       200:
 *         description: Login successful — returns JWT and user profile.
 *       401:
 *         description: Invalid credentials.
 */
router.post('/login', rateLimiter_1.authLimiter, AuthController_1.default.login.bind(AuthController_1.default));
/**
 * @openapi
 * /api/auth/me:
 *   get:
 *     summary: Get the authenticated user's profile
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile returned successfully.
 *       401:
 *         description: Missing or invalid Authorization header.
 */
router.get('/me', authMiddleware_1.authMiddleware, AuthController_1.default.me.bind(AuthController_1.default));
exports.default = router;
