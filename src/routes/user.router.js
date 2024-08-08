// 회원가입

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
 *           minLength: 6
 *           pattern: '/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#])[A-Za-z\d!@#]{6,}$/'
 *         confirmPassword:
 *           type: string
 *           minLength: 6
 *           description: The user's confirmation password
 *           pattern: '/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#])[A-Za-z\d!@#]{6,}$/'
 *         nickname:
 *           type: string
 *           description: The user's nickname
 *           minLength: 4
 *           maxLength: 10
 *       example:
 *         username: minjae
 *         password: "abc123@#!"
 *         confirmPassword: "abc123@#!"
 *         nickname: mjmjmj
 */

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: 유저 회원가입 및 로그인
 */

/**
 * @swagger
 * /signup:
 *   post:
 *     summary: 회원가입
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

// 로그인

/**
 * @swagger
 * components:
 *   schemas:
 *     LoginRequest:
 *       type: object
 *       required:
 *         - username
 *         - password
 *       properties:
 *         username:
 *           type: string
 *           description: The user's username
 *           example: minjae
 *         password:
 *           type: string
 *           description: The user's password
 *           example: abc123@#!
 *     LoginResponse:
 *       type: object
 *       properties:
 *         token:
 *           type: string
 *           description: The JWT token for authentication
 *           example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *       required:
 *         - token
 */

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: 로그인(accessToken, refreshToken 발급)
 */

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Log in and receive a JWT token
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Login successful and JWT token returned
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
 *       400:
 *         description: Invalid username or password
 */

// AUTH 미들웨어
/**
 * @swagger
 * components:
 *   schemas:
 *     Post:
 *       type: object
 *       properties:
 *         username:
 *           type: string
 *           description: The username of the person who created the post
 *           example: jon
 *         title:
 *           type: string
 *           description: The title of the post
 *           example: post 1
 *     PostListResponse:
 *       type: array
 *       items:
 *         $ref: '#/components/schemas/Post'
 *   securitySchemes:
 *     jwtAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 * security:
 *   - jwtAuth: []
 */

/**
 * @swagger
 * tags:
 *   name: Posts
 *   description: 미들웨어 이용해서 token 발급 후 확인 가능
 */

/**
 * @swagger
 * /posts:
 *   get:
 *     summary: Retrieve a list of posts
 *     tags: [Posts]
 *     description: Fetches a list of posts. Requires authentication via JWT.
 *     responses:
 *       200:
 *         description: A list of posts
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PostListResponse'
 *       401:
 *         description: Unauthorized, authentication required
 *     security:
 *       - jwtAuth: []
 */

// refresh를 이용한 재생성
/**
 * @swagger
 * components:
 *   schemas:
 *     RefreshTokenResponse:
 *       type: object
 *       properties:
 *         accessToken:
 *           type: string
 *           description: The new access token
 *           example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *   securitySchemes:
 *     jwtAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 * security:
 *   - jwtAuth: []
 */

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: refreshToken을 이용해 accessToken 재발급
 */

/**
 * @swagger
 * /refresh:
 *   get:
 *     summary: Refresh access token using a refresh token
 *     tags: [Authentication]
 *     description: Validates the refresh token and provides a new access token. Requires authentication via JWT.
 *     responses:
 *       200:
 *         description: A new access token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RefreshTokenResponse'
 *       403:
 *         description: Forbidden, invalid or missing refresh token
 *     security:
 *       - jwtAuth: []
 */
