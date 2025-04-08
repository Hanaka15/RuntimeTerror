const { Token } = require("../models");

class TokenController {
    static async createToken(req, res) { // ordner den faktisk token?
        try {
            //const { name } = req.body;
            //const researcherId = req.researcher.id;

            const token = new Token({
            //    name,
            //    owner: researcherId
            });

            await token.save();

            res.status(201).json({ message: "Token created successfully", token });
        } catch (error) {
            console.error("Token Creation Error:", error);
            res.status(500).json({ message: "Server error", error: error.message });
        }
    }
}

module.exports = TokenController;

/* class WorkspaceController {
    static async createWorkspace(req, res) {
        try {
            const { name } = req.body;
            const researcherId = req.researcher.id;

            const workspace = new Workspace({
                name,
                owner: researcherId
            });

            await workspace.save();

            res.status(201).json({ message: "Workspace created successfully", workspace });
        } catch (error) {
            console.error("Workspace Creation Error:", error);
            res.status(500).json({ message: "Server error", error: error.message });
        }
    }
}

module.exports = WorkspaceController; */
