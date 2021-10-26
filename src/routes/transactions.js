const express = require("express");
const TransactionController = require("../controllers/TransactionController");
const { authMiddleware } = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/", authMiddleware, TransactionController.index);
router.post("/store", authMiddleware, TransactionController.store);
router.get("/show/:id", authMiddleware, TransactionController.show);
router.put("/update/:id", authMiddleware, TransactionController.update);
router.delete("/destroy/:id", authMiddleware, TransactionController.destroy);
router.post("/get-price", authMiddleware, TransactionController.getPrice);

module.exports = router;
