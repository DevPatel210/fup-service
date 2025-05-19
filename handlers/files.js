const express = require('express');
const filesController = require('../controllers/files');
const authenticateToken = require('../middlewares/authMiddleware');
const {upload:uploadFile, handleMulterError} = require('../middlewares/multerUpload');
const router = express.Router();

/**
 * @swagger
 * /file/upload:
 *  post:
 *    summary: Upload a new file.
 *    requestBody:
 *      required: true
 *      content:
 *        multipart/form-data:
 *          schema:
 *            type: object
 *            properties:
 *              title:
 *                type: string
 *              description:
 *                type: string
 *              file:
 *                type: string
 *                format: binary
 *    responses:
 *      201:
 *        description: File uploaded successfully. Will be processed soon.
 *      400:
 *        description: Invalid inputs.
 *      401:
 *        description: Invalid/expired token.
 *      500:
 *        description: Failed to upload file.
 */
router.post('/upload', authenticateToken, uploadFile.single('file'), handleMulterError, filesController.uploadFile);

/**
 * @swagger
 * /file/myfiles :
 *  get:
 *    summary: Get Files uploaded by you.
 *    responses:
 *      200:
 *        description: Files fetched successfully.
 *      401:
 *        description: Invalid/expired token.
 *      500:
 *        description: Failed to fetch file.
 */
router.get('/myfiles', authenticateToken, filesController.getFilesForUser);


/**
 * @swagger
 * /file/{fileId} :
 *  get:
 *    summary: Get File details.
 *    parameters:
 *      - in: path
 *        name: fileId
 *        schema:
 *          type: integer
 *        required: true
 *        description: Numeric ID of the file to get
 *    responses:
 *      200:
 *        description: File fetched successfully.
 *      400:
 *        description: Invalid file id.
 *      401:
 *        description: Invalid/expired token.
 *      500:
 *        description: Failed to fetch file.
 */
router.get('/:fileId', authenticateToken, filesController.getFile);

module.exports = router;