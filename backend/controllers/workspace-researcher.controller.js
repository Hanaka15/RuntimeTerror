const { WorkspaceResearcher } = require("../models");

class WorkspaceResearcherController {
    static async createCollaborativeWorkspace(req, res) {
        try {
            const { collaborativewsname } = req.body;
            const researcherId = req.researcher.id;

            const collaborativeWorkspace = new WorkspaceResearcher({
                collaborativewsname,
                owner: researcherId
            });

            await collaborativeWorkspace.save();

            res.status(201).json({ message: "Collaborative workspace created successfully", collaborativeWorkspace });
        } catch (error) {
            console.error("Collaborative Workspace Creation Error:", error);
            res.status(500).json({ message: "Server error", error: error.message });
        }
    }
}

module.exports = WorkspaceResearcherController;