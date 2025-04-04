const { Study } = require("../models");

class StudyController {
    static async createStudy(req, res) {
        try {
            const { studyname } = req.body;
            const workspaceId = req.workspace.id;

            const study = new Study({
                studyname,
                owner: workspaceId
            });

            await study.save();

            res.status(201).json({ message: "Study created successfully", study });
        } catch(error) {
            console.error("Study Creation Error: ", error);
            res.status(500).json({ message: "Server error", error: error.message });
        }
    } 
}

module.exports = StudyController;