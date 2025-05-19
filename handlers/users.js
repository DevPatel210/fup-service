const express = require('express');
const userController = require('../controllers/users');
const router = express.Router();

/**
 * @swagger
 * /auth/register:
 *  post:
 *    summary: Register a new user.
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              name:
 *                type: string
 *              email:
 *                type: string
 *                format: email
 *              password:
 *                type: string
 *                format: password
 *    responses:
 *      201:
 *        description: User registered successfully.
 *      409:
 *        description: Username or email already exists.
 *      500:
 *        description: Failed to register user.
 */
router.post('/register', userController.registerUser);

/**
 * @swagger
 * /auth/login:
 *  post:
 *    summary: Authenticate user and get a JWT token.
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              email:
 *                type: string
 *                format: email
 *              password:
 *                type: string
 *                format: password
 *    responses:
 *      200:
 *        description: Authentication successful, returns a JWT token.
 *      401:
 *        description: Invalid credentials.
 *      500:
 *        description: Failed to login.
 */
router.post('/login', userController.loginUser);

module.exports = router;