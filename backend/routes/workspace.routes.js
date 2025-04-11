const express = require("express");
const WorkspaceController = require("../controllers/workspace.controller");
const AuthMiddleware = require("../middleware/auth.middleware");

const router = express.Router();


router.post("/", AuthMiddleware.authenticateAccessToken, WorkspaceController.createWorkspace);
router.get("/", AuthMiddleware.authenticateAccessToken, WorkspaceController.getAllWorkspaces);
router.get("/:workspace_id", AuthMiddleware.authenticateAccessToken, WorkspaceController.getWorkspaceById);
router.patch("/:workspace_id", AuthMiddleware.authenticateAccessToken, WorkspaceController.updateWorkspace);
router.delete("/:workspace_id", AuthMiddleware.authenticateAccessToken, WorkspaceController.deleteWorkspace);

module.exports = router;
