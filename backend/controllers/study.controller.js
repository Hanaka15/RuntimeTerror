const { Study } = require("../models");

class StudyController {

    //CREATE study
    static async createStudy(req, res) {
        try {
            const { workspace_id } = req.params;
            const { studyname, studyId } = req.body;

            const study = new Study({
                id: studyId,
                studyname,
                workspaceId: workspace_id
            });

            await study.save();

            res.status(201).json({ message: "Study created successfully", study });
        } catch (error) {
            console.error("Study Creation Error: ", error);
            res.status(500).json({ message: "Server error", error: error.message });
        }
    }

    //READ all studies
    static async getAllStudies(req, res) {
        try {
            const { workspace_id } = req.params;
            const studies = await Study.findAll({ where: {workspaceId: workspace_id} });
            res.status(200).json(studies);
        } catch (error) {
            console.error("Error fetching studies:", error);
            res.status(500).json({ message: "Server error", error: error.message });
        }
    }

    //READ single study
    static async getStudyById(req, res) {
        try {
            const { workspace_id, study_id } = req.params;
            const study = await Study.findOne({ where: { id: study_id, workspaceId: workspace_id }});

            if (!study) {
                return res.status(404).json({ message: "Study not found" });
            }
            res.status(200).json(study);
        } catch (error) {
            console.error("Error fetching study:", error);
            res.status(500).json({ message: "Server error", error: error.message });
        }
    }

    //UPDATE study
    static async updateStudy(req, res) {
        try {
            const { workspace_id, study_id } = req.params;
            const { studyname } = req.body;

            const study = await Study.findOne({ where: { id: study_id, workspaceId: workspace_id } })

            if (!study) {
                return res.status(404).json({ message: "Study not found" });
            }

            if (studyname) {
                study.studyname = studyname;
            }

            await study.save();
            res.status(200).json({ message: "Study updated successfully", study });
        } catch (error) {
            console.error("study update error:", error);
            res.status(500).json({ message: "Server error", error: error.message });
        }
    }

    //DELETE study 
    static async deleteStudy(req, res) {
        try {
            const { workspace_id, study_id } = req.params;
            const study = await Study.findOne({ where: {id: study_id, workspaceId: workspace_id}});

            if (!study) {
                return res.status(404).json({ message: "Study not found" });
            }

            await study.destroy();
            res.status(200).json({ message: "Study deleted successfully" });
        } catch (error) {
            console.error("Study delete error:", error);
            res.status(500).json({ message: "Server error", error: error.message });
        }
    }
}

module.exports = StudyController;