const express = require("express");
const AuthController = require("../controllers/AuthController");
const { authMiddleware } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/login", AuthController.login);
router.post("/register", AuthController.register);
router.post("/forgot", AuthController.forgot);
router.post("/reset", AuthController.reset);
router.get("/logout", authMiddleware, AuthController.logout);

module.exports = router;
