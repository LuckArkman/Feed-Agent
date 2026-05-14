"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadNewsSource = exports.uploadMiddleware = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const multer_1 = __importDefault(require("multer"));
const AppError_1 = require("../utils/AppError");
// ─────────────────────────────────────────────────────────────────────────────
// Configuration
// ─────────────────────────────────────────────────────────────────────────────
const UPLOADS_DIR = path_1.default.resolve(process.cwd(), 'uploads');
const MAX_FILE_SIZE_MB = 10;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
// Ensure the uploads directory exists on startup
if (!fs_1.default.existsSync(UPLOADS_DIR)) {
    fs_1.default.mkdirSync(UPLOADS_DIR, { recursive: true });
}
// ─────────────────────────────────────────────────────────────────────────────
// Multer Storage Engine
// ─────────────────────────────────────────────────────────────────────────────
const storage = multer_1.default.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, UPLOADS_DIR);
    },
    filename: (_req, file, cb) => {
        // Generate a unique, safe filename: timestamp-random.ext
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        const ext = path_1.default.extname(file.originalname).toLowerCase();
        cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
    },
});
// ─────────────────────────────────────────────────────────────────────────────
// File Filter & Validation
// ─────────────────────────────────────────────────────────────────────────────
const fileFilter = (_req, file, cb) => {
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    }
    else {
        cb(new AppError_1.AppError(`Invalid file type: ${file.mimetype}. Allowed types are: JPEG, PNG, PDF.`, 415), false);
    }
};
// ─────────────────────────────────────────────────────────────────────────────
// Exported Middleware instances
// ─────────────────────────────────────────────────────────────────────────────
exports.uploadMiddleware = (0, multer_1.default)({
    storage,
    limits: { fileSize: MAX_FILE_SIZE_BYTES },
    fileFilter,
});
/**
 * Middleware for single file upload (news source image/pdf).
 * Form field name must be "file".
 */
exports.uploadNewsSource = exports.uploadMiddleware.single('file');
