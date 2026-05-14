"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OcrService = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const tesseract_js_1 = __importDefault(require("tesseract.js"));
const sharp_1 = __importDefault(require("sharp"));
const logger_1 = __importDefault(require("../utils/logger"));
const AppError_1 = require("../utils/AppError");
// pdf-parse types are often incompatible with ES modules in ts
const pdfParse = require('pdf-parse');
class OcrService {
    /**
     * Extracts text from an uploaded file (Image or PDF).
     * Images are processed via Tesseract.js (pt-BR).
     * PDFs are processed natively via pdf-parse to extract embedded text.
     *
     * @param filePath - Absolute path to the saved file on disk.
     * @param mimetype - The MIME type of the file.
     * @returns The sanitized extracted text and confidence level.
     */
    async extractText(filePath, mimetype) {
        if (!fs_1.default.existsSync(filePath)) {
            throw new AppError_1.AppError('File not found for OCR processing.', 404);
        }
        let rawText = '';
        let confidenceScore = 100; // Default to 100% for digital PDFs
        try {
            if (mimetype === 'application/pdf') {
                logger_1.default.info(`[ocr]: Extracting text from PDF via pdf-parse: ${path_1.default.basename(filePath)}`);
                const dataBuffer = fs_1.default.readFileSync(filePath);
                const pdfData = await pdfParse(dataBuffer);
                rawText = pdfData.text;
            }
            else if (mimetype.startsWith('image/')) {
                logger_1.default.info(`[ocr]: Preprocessing image for OCR: ${path_1.default.basename(filePath)}`);
                // Enhance image for better OCR accuracy (grayscale, normalize contrast, binarize)
                const processedImageBuffer = await this.enhanceImageForOcr(filePath);
                logger_1.default.info(`[ocr]: Running Tesseract.js (por) on preprocessed image...`);
                const { data: { text, confidence } } = await tesseract_js_1.default.recognize(processedImageBuffer, 'por', // Portuguese language pack
                {
                    logger: (m) => {
                        // Only log progression milestones to avoid log spam
                        if (m.status === 'recognizing text' && m.progress % 0.25 < 0.05) {
                            logger_1.default.info(`[ocr]: Tesseract progress: ${(m.progress * 100).toFixed(0)}%`);
                        }
                    },
                });
                rawText = text;
                confidenceScore = confidence;
                logger_1.default.info(`[ocr]: Tesseract processing finished with ${confidenceScore.toFixed(2)}% confidence.`);
                // Validate Confidence Level (Threshold: 60%)
                if (confidenceScore < 60) {
                    throw new AppError_1.AppError(`Imagem ilegível ou de baixíssima qualidade (Confiança: ${confidenceScore.toFixed(2)}%). Por favor, envie uma foto mais nítida, com boa iluminação e foco.`, 422 // Unprocessable Entity
                    );
                }
            }
            else {
                throw new AppError_1.AppError(`Unsupported mime type for text extraction: ${mimetype}`, 415);
            }
        }
        catch (error) {
            if (error instanceof AppError_1.AppError)
                throw error; // Re-throw business validation errors
            const err = error;
            logger_1.default.error(`[ocr]: Failed to extract text: ${err.message}`, { stack: err.stack });
            throw new AppError_1.AppError(`Failed to process document text: ${err.message}`, 500);
        }
        const cleanedText = this.cleanText(rawText);
        if (!cleanedText) {
            logger_1.default.warn(`[ocr]: Extracted text from ${path_1.default.basename(filePath)} was empty after cleaning.`);
        }
        else {
            logger_1.default.info(`[ocr]: Successfully extracted ${cleanedText.length} characters.`);
        }
        return { text: cleanedText, confidence: confidenceScore };
    }
    /**
     * Sanitizes the OCR output.
     * - Removes zero-width characters, null bytes, and control characters (except newlines/tabs).
     * - Normalizes multiple spaces into a single space.
     * - Trims excessive leading/trailing whitespace.
     *
     * @param text - Raw text from OCR/PDF engine.
     * @returns Cleaned string.
     */
    cleanText(text) {
        if (!text)
            return '';
        return text
            // Remove zero-width spaces and non-printable control characters (except \n, \r, \t)
            .replace(/[\u200B-\u200D\uFEFF]/g, '')
            .replace(/[\x00-\x08\x0B-\x0C\x0E-\x1F\x7F]/g, '') // control chars
            // Reduce multiple vertical blank lines to a maximum of two
            .replace(/\n\s*\n\s*\n/g, '\n\n')
            // Reduce multiple horizontal spaces to a single space
            .replace(/[ \t]+/g, ' ')
            .trim();
    }
    /**
     * Preprocesses an image using Sharp to maximize OCR accuracy.
     * Operations:
     * - Resize (downscale if width > 2000 to save memory, upscale if < 800 to improve clarity)
     * - Grayscale conversion
     * - Contrast normalization
     * - Threshold binarization (sharpens text edges)
     *
     * @param filePath - Path to the original uploaded image.
     * @returns A Buffer containing the optimized image.
     */
    async enhanceImageForOcr(filePath) {
        const image = (0, sharp_1.default)(filePath);
        const metadata = await image.metadata();
        let pipeline = image;
        // Resize based on optimal OCR dimensions (Tesseract prefers ~300 DPI or clear sizing)
        // Downscaling to 1600px instead of 2500px reduces pixel count by over 50%, 
        // significantly accelerating Tesseract while retaining high OCR precision.
        if (metadata.width) {
            if (metadata.width > 1600) {
                pipeline = pipeline.resize({ width: 1600, withoutEnlargement: true });
            }
            else if (metadata.width < 800) {
                // Upscale small images (like screenshots) to give Tesseract more pixels
                pipeline = pipeline.resize({ width: 1200, withoutEnlargement: false });
            }
        }
        return pipeline
            .grayscale() // Remove color noise
            .normalize() // Stretch contrast (make blacks blacker, whites whiter)
            .threshold(120) // Adaptive/optimized binarize threshold for OCR
            .png({ compressionLevel: 9 }) // Maximize PNG compression to save RAM/CPU memory buffer
            .toBuffer();
    }
}
exports.OcrService = OcrService;
exports.default = new OcrService();
