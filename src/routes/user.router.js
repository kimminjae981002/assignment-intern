/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - username
 *         - password
 *         - confirmPassword
 *         - nickname
 *       properties:
 *         username:
 *           type: string
 *           description: The user's username
 *           minLength: 5
 *           maxLength: 20
 *           pattern: '^[a-zA-Z0-9]*$'
 *         password:
 *           type: string
 *           description: The user's password
 *           minLength: 8
 *         confirmPassword:
 *           type: string
 *           minLength: 8
 *           description: The user's confirmation password
 *         nickname:
 *           type: string
 *           description: The user's nickname
 *           minLength: 4
 *           maxLength: 10
 *       example:
 *         username: minjae
 *         password: 12345678
 *         confirmPassword: 12345678
 *         nickname: mjmj
 */

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management
 */

/**
 * @swagger
 * /signup:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: The user was successfully created
 *       400:
 *         description: The user already exists or passwords do not match
 */
