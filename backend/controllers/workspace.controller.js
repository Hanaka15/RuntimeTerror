const { Workspace } = require("../models");

/* class WorkspaceController {
    static async createWorkspace(req, res) {
        try {
            const { name } = req.body;
            const userId = req.user.id;

            const workspace = new Workspace({
                name,
                owner: userId
            });

            await workspace.save();

            res.status(201).json({ message: "Workspace created successfully", workspace });
        } catch (error) {
            console.error("Workspace Creation Error:", error);
            res.status(500).json({ message: "Server error", error: error.message });
        }
    }
} */

class WorkspaceController {
  static async createWorkspace(req, res) {
    try {
      const { name } = req.body;
      const userId = req.user.id;
      console.log(req.user);

      const workspace = await Workspace.create({
        name,
        ownerId: userId,
      });

      res
        .status(201)
        .json({ message: "Workspace created successfully", workspace });
    } catch (error) {
      console.error("Workspace Creation Error:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }
}

module.exports = WorkspaceController;
