const { Question } = require("../models");

class QuestionController {
    static async createQuestion(req, res) {
        try {
            const { study_id } = req.params;
            const { questionText, questionId, artifacts, correctArtifactIndex, artifactType } = req.body;

            const question = await Question.create({
                id: questionId,
                questionText,
                studyId: study_id,
                artifacts,
                correctArtifactIndex,
                artifactType
            });

            res.status(201).json({ message: "Question created successfully", question });
        } catch (error) {
            res.status(500).json({ message: "Server error", error: error.message });
        }
    }

    static async getAllQuestions(req, res) {
        try {
            const { study_id } = req.params;
            const questions = await Question.findAll({ where: { studyId: study_id } });
            res.status(200).json(questions);
        } catch (error) {
            res.status(500).json({ message: "Server error", error: error.message });
        }
    }

    static async getQuestionById(req, res) {
        try {
            const { study_id, question_id } = req.params;
            const question = await Question.findOne({ where: { id: question_id, studyId: study_id } });

            if (!question) {
                return res.status(404).json({ message: "Question not found" });
            }

            res.status(200).json(question);
        } catch (error) {
            res.status(500).json({ message: "Server error", error: error.message });
        }
    }

    static async updateQuestion(req, res) {
        try {
            const { study_id, question_id } = req.params;
            const { questionText, artifacts, correctArtifactIndex, artifactType } = req.body;

            const question = await Question.findOne({ where: { id: question_id, studyId: study_id } });
            if (!question) {
                return res.status(404).json({ message: "Question not found" });
            }

            await question.update({
                questionText,
                artifacts,
                correctArtifactIndex,
                artifactType
            });

            res.status(200).json({ message: "Question updated successfully", question });
        } catch (error) {
            res.status(500).json({ message: "Server error", error: error.message });
        }
    }

    static async deleteQuestion(req, res) {
        try {
            const { study_id, question_id } = req.params;
            const question = await Question.findOne({ where: { id: question_id, studyId: study_id } });

            if (!question) {
                return res.status(404).json({ message: "Question not found" });
            }

            await question.destroy();
            res.status(200).json({ message: "Question deleted successfully" });
        } catch (error) {
            res.status(500).json({ message: "Server error", error: error.message });
        }
    }
}

module.exports = QuestionController;
