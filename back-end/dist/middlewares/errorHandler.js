"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const AppError_1 = require("../utils/AppError");
const ApiResponse_1 = require("../utils/ApiResponse");
const logger_1 = __importDefault(require("../utils/logger"));
const errorHandler = (err, req, res, next) => {
    if (err instanceof AppError_1.AppError) {
        logger_1.default.warn(`Operational Error: ${err.message}`);
        return ApiResponse_1.ApiResponse.error(res, err.message, err.statusCode);
    }
    let logMessage = err.message;
    let logStack = err.stack;
    // Sanitize sensitive info from logs in production
    if (process.env.NODE_ENV === 'production') {
        const sensitivePatterns = [
            /postgres:\/\/.*@/g,
            /mongodb(?:\+srv)?:\/\/.*@/g,
            /Bearer [A-Za-z0-9\-\._~\+\/]+/gi,
            /(eyJ[a-zA-Z0-9_-]{5,}\.[a-zA-Z0-9_-]{5,}\.[a-zA-Z0-9_-]{5,})/gi // JWTs
        ];
        for (const pattern of sensitivePatterns) {
            if (logMessage)
                logMessage = logMessage.replace(pattern, '***REDACTED***');
            if (logStack)
                logStack = logStack.replace(pattern, '***REDACTED***');
        }
    }
    // Log unexpected errors
    logger_1.default.error(`Unexpected Error: ${logMessage}`, { stack: logStack });
    // Do not leak error details to the client in production
    const responseMessage = process.env.NODE_ENV === 'production' ? 'Internal Server Error' : err.message;
    const responseDetails = process.env.NODE_ENV === 'production' ? undefined : err.stack;
    return ApiResponse_1.ApiResponse.error(res, responseMessage, 500, responseDetails);
};
exports.errorHandler = errorHandler;
