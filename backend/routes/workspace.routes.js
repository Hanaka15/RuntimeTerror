const express = require("express");
const WorkspaceController = require("../controllers/workspace.controller");
const { authenticateToken } = require("../middleware/auth.middleware");

const router = express.Router();


//create
router.post("/", authenticateToken, WorkspaceController.createWorkspace);

//read
router.get("/", authenticateToken, WorkspaceController.getAllWorkspaces);
router.get("/:id", authenticateToken, WorkspaceController.getWorkspaceById);

//update
router.patch("/:id", authenticateToken, WorkspaceController.updateWorkspace);

//delete 
router.delete("/:id", authenticateToken, WorkspaceController.deleteWorkspace);


module.exports = router;