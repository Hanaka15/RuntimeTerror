const express = require("express");
const QuestionController = require("../controllers/workspace.controller");
const { authenticateToken } = require("../middleware/auth.middleware");

const router = express.Router();

router.post("/create/study/question", authenticateToken, QuestionController.createQuestion);

module.exports = router;