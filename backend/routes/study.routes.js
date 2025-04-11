const express = require("express");
const StudyController = require("../controllers/study.controller");
const AuthMiddleware = require("../middleware/auth.middleware");

const router = express.Router();

router.post("/workspaces/:workspace_id/studies", AuthMiddleware.authenticateAccessToken, StudyController.createStudy);
router.get("/workspaces/:workspace_id/studies", AuthMiddleware.authenticateAccessToken, StudyController.getAllStudies);
router.get("/workspaces/:workspace_id/studies/:study_id", AuthMiddleware.authenticateAccessToken, StudyController.getStudyById);
router.patch("/workspaces/:workspace_id/studies/:study_id", AuthMiddleware.authenticateAccessToken, StudyController.updateStudy);
router.delete("/workspaces/:workspace_id/studies/:study_id", AuthMiddleware.authenticateAccessToken, StudyController.deleteStudy);

module.exports = router;
