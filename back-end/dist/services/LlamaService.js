"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LlamaService = void 0;
const axios_1 = __importDefault(require("axios"));
const logger_1 = __importDefault(require("../utils/logger"));
const AppError_1 = require("../utils/AppError");
// ─────────────────────────────────────────────────────────────────────────────
// Configuration
// ─────────────────────────────────────────────────────────────────────────────
const OLLAMA_BASE_URL = process.env.OLLAMA_URL || 'http://localhost:11434';
const DEFAULT_MODEL = process.env.LLAMA_MODEL || 'llama3';
// ─────────────────────────────────────────────────────────────────────────────
// Service Definition
// ─────────────────────────────────────────────────────────────────────────────
/**
 * Service responsible for communicating with the local Ollama instance (or external API)
 * to run inference on the Llama models.
 */
class LlamaService {
    client;
    constructor() {
        this.client = axios_1.default.create({
            baseURL: OLLAMA_BASE_URL,
            headers: {
                'Content-Type': 'application/json',
            },
            // Set a generous timeout since LLM inference can take several seconds
            timeout: 120_000,
        });
        logger_1.default.info(`[llama-service]: Initialized with base URL ${OLLAMA_BASE_URL}`);
    }
    /**
     * Generates a completion from the Llama model based on a prompt.
     *
     * @param prompt - The instruction/input text for the model.
     * @param systemPrompt - Optional system instructions (e.g. persona definition).
     * @param params - Optional inference parameters (temperature, max_tokens, etc).
     * @returns The generated response string.
     */
    async generateCompletion(prompt, systemPrompt, params) {
        try {
            logger_1.default.info(`[llama-service]: Sending prompt to ${DEFAULT_MODEL} model...`);
            const payload = {
                model: DEFAULT_MODEL,
                prompt: prompt,
                stream: false, // We want the full response at once for now
                options: {
                    temperature: params?.temperature ?? 0.3, // Lower temperature for more deterministic/factual outputs
                    top_p: params?.top_p ?? 0.9,
                    num_predict: params?.max_tokens ?? 1024,
                },
            };
            if (params?.format === 'json') {
                payload.format = 'json';
            }
            if (systemPrompt) {
                payload.system = systemPrompt;
            }
            const response = await this.client.post('/api/generate', payload);
            if (response.status !== 200) {
                throw new AppError_1.AppError(`Ollama API returned status ${response.status}`, 502);
            }
            logger_1.default.info('[llama-service]: Received completion from model.');
            return response.data.response;
        }
        catch (error) {
            logger_1.default.error(`[llama-service]: Failed to generate completion - ${error.message}`);
            if (error.code === 'ECONNREFUSED') {
                throw new AppError_1.AppError('Llama/Ollama service is unreachable. Is the daemon running?', 503);
            }
            throw new AppError_1.AppError(`AI Generation Error: ${error.message}`, 500);
        }
    }
    /**
     * Pings the Ollama service to check if it's healthy and available.
     */
    async checkHealth() {
        try {
            const response = await this.client.get('/');
            return response.status === 200;
        }
        catch {
            return false;
        }
    }
}
exports.LlamaService = LlamaService;
exports.default = new LlamaService();
