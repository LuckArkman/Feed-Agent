"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ContactController_1 = __importStar(require("../controllers/ContactController"));
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = (0, express_1.Router)();
// All contact routes require a valid JWT
router.use(authMiddleware_1.authMiddleware);
/**
 * @openapi
 * /api/contacts:
 *   post:
 *     summary: Create a new contact
 *     tags: [Contacts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [phoneNumber, name]
 *             properties:
 *               phoneNumber: { type: string, example: "5511999990001" }
 *               name:        { type: string, example: "João da Silva" }
 *     responses:
 *       201: { description: Contact created. }
 *       400: { description: Invalid phone number format. }
 *       409: { description: Phone already registered for this account. }
 */
router.post('/', ContactController_1.default.create.bind(ContactController_1.default));
/**
 * @openapi
 * /api/contacts:
 *   get:
 *     summary: List contacts (paginated)
 *     tags: [Contacts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 20 }
 *       - in: query
 *         name: onlyActive
 *         schema: { type: boolean }
 *         description: Filter by active contacts only.
 *     responses:
 *       200:
 *         description: Paginated list of contacts.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:       { type: array }
 *                 total:      { type: integer }
 *                 page:       { type: integer }
 *                 limit:      { type: integer }
 *                 totalPages: { type: integer }
 */
router.get('/', ContactController_1.default.findAll.bind(ContactController_1.default));
/**
 * @openapi
 * /api/contacts/import:
 *   post:
 *     summary: Import contacts via CSV file
 *     tags: [Contacts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: "CSV with columns: name, phoneNumber"
 *     responses:
 *       201:
 *         description: Import summary (imported, skipped, errors).
 *       422:
 *         description: Invalid CSV format.
 */
router.post('/import', ContactController_1.csvUpload.single('file'), ContactController_1.default.importCsv.bind(ContactController_1.default));
/**
 * @openapi
 * /api/contacts/{id}:
 *   put:
 *     summary: Update a contact
 *     tags: [Contacts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:   { type: string }
 *               active: { type: boolean }
 *     responses:
 *       200: { description: Contact updated. }
 *       404: { description: Not found. }
 */
router.put('/:id', ContactController_1.default.update.bind(ContactController_1.default));
/**
 * @openapi
 * /api/contacts/{id}:
 *   delete:
 *     summary: Delete a contact
 *     tags: [Contacts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Contact deleted. }
 *       404: { description: Not found. }
 */
router.delete('/:id', ContactController_1.default.remove.bind(ContactController_1.default));
exports.default = router;
