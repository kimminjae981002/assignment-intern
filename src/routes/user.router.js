// routes/user.router.js
const express = require("express");
const userController = require("../controllers/user.controller");
const { authMiddleware } = require("../../middleware/authMiddleware");

const router = express.Router();

router.post("/signup", userController.signup);
router.post("/login", userController.login);
router.get("/posts", authMiddleware, userController.getPosts);
router.get("/refresh", userController.refreshToken);

module.exports = router;
