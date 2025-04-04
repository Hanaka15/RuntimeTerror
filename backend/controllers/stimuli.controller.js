const { Stimuli } = require("../models");

class StimuliController {
    static async uploadStimuli(req, res) {
        try {
            const {  } = req.body;
            const studyId = req.study.id;

            const question = new Question({
                questiontext,
                owner: questionId
            });

            await stimuli.save();

            res.status(201).json({ message: "Question created successfully", question });
        } catch(error) {
            console.error("Question Creation Error: ", error);
            res.status(500).json({ message: "Server error", error: error.message });
        }
    }
}

module.exports = StimuliController;