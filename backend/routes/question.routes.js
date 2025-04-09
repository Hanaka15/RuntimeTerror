const express = require("express");
const QuestionController = require("../controllers/question.controller");
const { authenticateToken } = require("../middleware/auth.middleware");

const router = express.Router({ mergeParams: true }); 

// Create
router.post("/workspaces/:workspace_id/studies/:study_id/questions", authenticateToken, QuestionController.createQuestion);

// Read
router.get("/workspaces/:workspace_id/studies/:study_id/questions", authenticateToken, QuestionController.getAllQuestions);
router.get("/workspaces/:workspace_id/studies/:study_id/questions/:question_id", authenticateToken, QuestionController.getQuestionById);

// Update
router.patch("/workspaces/:workspace_id/studies/:study_id/questions/:question_id", authenticateToken, QuestionController.updateQuestion);

// Delete
router.delete("/workspaces/:workspace_id/studies/:study_id/questions/:question_id", authenticateToken, QuestionController.deleteQuestion);

module.exports = router;
