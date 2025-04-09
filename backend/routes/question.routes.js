const express = require("express");
const QuestionController = require("../controllers/question.controller");
const { authenticateToken } = require("../middleware/auth.middleware");

const router = express.Router();

//create
router.post("/", authenticateToken, QuestionController.createQuestion);

//read
router.get("/", authenticateToken, QuestionController.getAllQuestions);
router.get("/:id", authenticateToken, QuestionController.getQuestionById);

//update
router.patch("/:id", authenticateToken, QuestionController.updateQuestion);

//delete
router.delete("/:id", authenticateToken, QuestionController.deleteQuestion);


module.exports = router;