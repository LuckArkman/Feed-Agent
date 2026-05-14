"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ApiResponse_1 = require("../utils/ApiResponse");
const router = (0, express_1.Router)();
/**
 * @openapi
 * /health:
 *   get:
 *     summary: API Health Check
 *     description: Returns the health status of the API
 *     tags:
 *       - System
 *     responses:
 *       200:
 *         description: API is running smoothly.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Feed Agent AI - API is healthy!
 */
router.get('/', (req, res) => {
    ApiResponse_1.ApiResponse.success(res, null, 'Feed Agent AI - API is healthy!');
});
exports.default = router;
