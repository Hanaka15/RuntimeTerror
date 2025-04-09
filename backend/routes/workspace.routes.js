const express = require("express");
const WorkspaceController = require("../controllers/workspace.controller");
const { authenticateToken } = require("../middleware/auth.middleware");

const router = express.Router();

// Create
router.post("/", authenticateToken, WorkspaceController.createWorkspace);

// Read
router.get("/", authenticateToken, WorkspaceController.getAllWorkspaces);
router.get("/:workspace_id", authenticateToken, WorkspaceController.getWorkspaceById);

// Update
router.patch("/:workspace_id", authenticateToken, WorkspaceController.updateWorkspace);

// Delete 
router.delete("/:workspace_id", authenticateToken, WorkspaceController.deleteWorkspace);

module.exports = router;
