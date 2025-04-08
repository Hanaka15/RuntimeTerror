const express = require("express");
const WorkspaceController = require("../controllers/workspace.controller");
const { authenticateToken } = require("../middleware/auth.middleware");

const router = express.Router();

router.post("/create", authenticateToken, WorkspaceController.createWorkspace);
router.patch("/create", authenticateToken, WorkspaceController.createWorkspace);
router.get("/create", authenticateToken, WorkspaceController.createWorkspace);
router.delete("/create", authenticateToken, WorkspaceController.createWorkspace);

module.exports = router;