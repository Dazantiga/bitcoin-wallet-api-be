const express = require("express");
const TransactionController = require("../controllers/TransactionController");
const { authMiddleware } = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/", authMiddleware, TransactionController.index);
router.post("/store", authMiddleware, TransactionController.store);
router.get("/show", authMiddleware, TransactionController.show);
router.put("/update", authMiddleware, TransactionController.update);
router.delete("/destroy", authMiddleware, TransactionController.destroy);
router.post("/get-price", authMiddleware, TransactionController.getPrice);

module.exports = router;
