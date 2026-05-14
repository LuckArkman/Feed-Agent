"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiResponse = void 0;
class ApiResponse {
    static success(res, data, message = 'Success', statusCode = 200) {
        return res.status(statusCode).json({
            success: true,
            message,
            data,
        });
    }
    static error(res, error, statusCode = 500, details) {
        return res.status(statusCode).json({
            success: false,
            error,
            details,
        });
    }
}
exports.ApiResponse = ApiResponse;
