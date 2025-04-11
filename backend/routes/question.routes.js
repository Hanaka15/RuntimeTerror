const express = require("express");
const QuestionController = require("../controllers/question.controller");
const AuthMiddleware  = require("../middleware/auth.middleware");

const router = express.Router({ mergeParams: true }); 
router.post("/workspaces/:workspace_id/studies/:study_id/questions", AuthMiddleware.authenticateAccessToken, QuestionController.createQuestion);
router.get("/workspaces/:workspace_id/studies/:study_id/questions", AuthMiddleware.authenticateAccessToken, QuestionController.getAllQuestions);
router.get("/workspaces/:workspace_id/studies/:study_id/questions/:question_id", AuthMiddleware.authenticateAccessToken, QuestionController.getQuestionById);
router.patch("/workspaces/:workspace_id/studies/:study_id/questions/:question_id", AuthMiddleware.authenticateAccessToken, QuestionController.updateQuestion);
router.delete("/workspaces/:workspace_id/studies/:study_id/questions/:question_id", AuthMiddleware.authenticateAccessToken, QuestionController.deleteQuestion);

module.exports = router;
