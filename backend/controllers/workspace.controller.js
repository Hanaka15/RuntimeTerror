const { Workspace } = require("../models");

class WorkspaceController {

    static async createWorkspace(req, res) {
        try {
            const { name } = req.body;
            const researcherId = req.user.id;

            const workspace = new Workspace({
                name,
                ownerId: researcherId
            });

            await workspace.save();

            res.status(201).json({ message: "Workspace created successfully", workspace });
        } catch (error) {
            console.error("Workspace Creation Error:", error);
            res.status(500).json({ message: "Server error", error: error.message });
        }
    }

    static async getAllWorkspaces(req, res) {
        try {
            const researcherId = req.user.id;
            const workspaces = await Workspace.findAll({where: {ownerId: researcherId}});
            res.status(200).json(workspaces);
        } catch (error) {
            console.error("Error fetching workspaces:", error);
            res.status(500).json({ message: "Server error", error: error.message });
        }
    }

    static async getWorkspaceById(req, res) {
        try {
            const { workspace_id } = req.params;
            const workspace = await Workspace.findByPk(workspace_id);

            if (!workspace) {
                return res.status(404).json({ message: "workspace not found" });
            }
            res.status(200).json(workspace);
        } catch (error) {
            console.error("Error fetching workspace", error);
            res.status(500).json({ message: "Server error", error: error.message });
        }
    }

    static async updateWorkspace(req, res) {
        try {
            const { workspace_id } = req.params;
            const { name } = req.body;

            const workspace = await Workspace.findByPk(workspace_id);

            if (!workspace) {
                return res.status(404).json({ message: "Workspace not found" });
            }

            if (name) {
                workspace.name = name;
            }

            await workspace.save();
            res.status(200).json({ message: "Workspace updated successfully", workspace });
        } catch (error) {
            console.error("workspace update error:", error);
            res.status(500).json({ message: "Server error", error: error.message });
        }
    }

    static async deleteWorkspace(req, res) {
        try {
            const { workspace_id } = req.params;

            const workspace = await Workspace.findByPk(workspace_id);

            if (!workspace) {
                return res.status(404).json({ message: "Workspace not found" });
            }

            await workspace.destroy();
            res.status(200).json({ message: "Workspace deleted successfully" });
        } catch (error) {
            console.error("Workspace delete error:", error);
            res.status(500).json({ message: "Server error", error: error.message });
        }
    }
}



module.exports = WorkspaceController;
