const { Question } = require("../models");

class QuestionController {
    static async createQuestion(req, res) {
        try {
            const { questiontext } = req.body;
            const studyId = req.study.id;

            const question = new Question({
                questiontext,
                owner: studyId
            });

            await question.save();

            res.status(201).json({ message: "Question created successfully", question });
        } catch(error) {
            console.error("Question Creation Error: ", error);
            res.status(500).json({ message: "Server error", error: error.message });
        }
    }
}

module.exports = QuestionController;