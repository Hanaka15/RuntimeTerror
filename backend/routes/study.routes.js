const express = require("express");
const StudyController = require("../controllers/study.controller");
const { authenticateToken } = require("../middleware/auth.middleware");

const router = express.Router();

// Create
router.post("/workspaces/:workspace_id/studies", authenticateToken, StudyController.createStudy);

// Read
router.get("/workspaces/:workspace_id/studies", authenticateToken, StudyController.getAllStudies);
router.get("/workspaces/:workspace_id/studies/:study_id", authenticateToken, StudyController.getStudyById);

// Update
router.patch("/workspaces/:workspace_id/studies/:study_id", authenticateToken, StudyController.updateStudy);

// Delete
router.delete("/workspaces/:workspace_id/studies/:study_id", authenticateToken, StudyController.deleteStudy);

module.exports = router;
