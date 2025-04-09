const { Question } = require("../models");

class QuestionController {

    //CREATE question
    static async createQuestion(req, res) {
        try {
            const { questionText, studyId, questionId, artifacts, correctArtifactIndex, artifactType } = req.body;
            
            const question = new Question({
                id: questionId,
                questionText,
                studyId,
                artifacts,
                correctArtifactIndex,
                artifactType
            });

            await question.save();

            res.status(201).json({ message: "Question created successfully", question });
        } catch(error) {
            console.error("Question Creation Error: ", error);
            res.status(500).json({ message: "Server error", error: error.message });
        }
    }

    //READ all questions
    static async getAllQuestions(req,res) {
        try {
            const questions = await Question.findAll();
            res.status(200).json(questions);
        } catch (error) {
            console.error("Error fetching questions:", error);
            res.status(500).json({ message: "Server error", error: error.message });
        }
    }
    //READ single question
    static async getQuestionById(req,res) {
        try {
            const { id } = req.params;
            const question = await Question.findByPk(id);
            
            if(!question) {
                return res.status(404).json({ message: "Question not found" });
            }

            res.status(200).json(question);
        } catch (error) {
            console.error("Error fetching question", error);
            res.status(500).json({ message: "Server error", error: error.message });
        }
    }

    //UPDATE question
    static async updateQuestion (req, res) {
        try {
            const { id } = req.params;
            const { questionText, artifacts, correctArtifactIndex, artifactType } = req.body;
            const question = await Question.findByPk(id);

            if (!question) {
                return res.status(404).json({ message: "Question not found" });
            }

            if (questionText !== undefined) question.questionText = questionText;
            if (artifacts !== undefined) question.artifacts = artifacts;
            if (correctArtifactIndex !== undefined) question.correctArtifactIndex = correctArtifactIndex;
            if (artifactType !== undefined) question.artifactType = artifactType;

            await question.save();
            res.status(200).json({ message: "Question updated successfully", question});
        } catch(error) {
            console.error("Question update error:", error);
            res.status(500).json({ message: "Server error", error: error.message });
        }
    }

    //DELETE question
    static async deleteQuestion(req, res) {
        try {
            const { id } = req.params;
            const question = await Question.findByPk(id);

            if (!question) {
                return res.status(404).json({ message: "Question not found" });
            }

            await question.destroy();
            res.status(200).json({ message: "Question deleted successfully" });
        } catch (error) {
            console.error("Question deletion error:", error);
            res.status(500).json({ message: "Server error", error: error.message });
        }
    }

}

module.exports = QuestionController;