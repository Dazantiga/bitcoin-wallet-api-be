const express = require("express");
const DashboardController = require("../controllers/DashboardController");
const { authMiddleware } = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/", authMiddleware, DashboardController.index);

module.exports = router;
