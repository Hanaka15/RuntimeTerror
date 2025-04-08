const { Answer } = require("../models");

class AnswerController {
    static async createAnswer(req, res) {
        try {
            const { givenanswer } = req.body;
            const studyId = req.study.id;

            const answer = new Answer({
                givenanswer,
                owner: studyId
            });

            await answer.save();

            res.status(201).json({ message: "Answer created successfully", answer });
        } catch(error) {
            console.error("Answer Creation Error: ", error);
            res.status(500).json({ message: "Server error", error: error.message });
        }
    }
}

module.exports = AnswerController;