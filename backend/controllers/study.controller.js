const Study = require("../models/study.model");
const StudyResearcher = require("../models/study-researcher.model");

const sendErrorResponse = (res, status, message, error) => {
    console.error(message, error);
    res.status(status).json({ message, error: error.message });
};

class StudyController {

    static async findStudyById(studyId) {
        const study = await Study.findOne({ id: studyId });
        if (!study) {
            throw new Error("Study not found");
        }
        return study;
    }

    static async createStudy(req, res) {
        try {
            const { studyname, questions } = req.body;

            const newStudy = await Study.create({
                studyname,
                ownerId: req.user.id,
                questions,
            });

            res.status(201).json({ message: "Study created successfully", study: newStudy });
        } catch (error) {
            sendErrorResponse(res, 500, "Study Creation Error:", error);
        }
    }

    static async getAllStudies(req, res) {
        try {
            const researcherId = req.user.id;
    
            const studyIds = await StudyResearcher.distinct("studyId", { researcherId });
            const studies = await Study.find({
                $or: [
                    { ownerId: researcherId },
                    { id: { $in: studyIds } }
                ]
            }).select("-questions");    
    
            res.status(200).json(studies);
        } catch (error) {
            sendErrorResponse(res, 500, "Error fetching studies:", error);
        }
    }

    static async getStudyById(req, res) {
        try {
            const { study_id } = req.params;
            const study = await this.findStudyById(study_id);

            res.status(200).json(study);
        } catch (error) {
            sendErrorResponse(res, error.message === "Study not found" ? 404 : 500, error.message, error);
        }
    }

    static async updateStudy(req, res) {
        try {
            const { study_id } = req.params;
            const study = await this.findStudyById(study_id);

            // Update entire study fields
            const { studyname, questions } = req.body;
            if (studyname) study.studyname = studyname;
            if (questions) study.questions = questions;

            await study.save();
            res.status(200).json({ message: "Study updated successfully", study });
        } catch (error) {
            sendErrorResponse(res, 500, "Study update error:", error);
        }
    }

    static async deleteStudy(req, res) {
        try {
            const { study_id } = req.params;
            const study = await this.findStudyById(study_id);

            if (study.ownerId !== req.user.id) {
                return res.status(403).json({ message: "You are not the owner of this study" });
            }

            await study.remove();
            res.status(200).json({ message: "Study deleted successfully" });
        } catch (error) {
            sendErrorResponse(res, error.message === "Study not found" ? 404 : 500, error.message, error);
        }
    }
}

module.exports = StudyController;
