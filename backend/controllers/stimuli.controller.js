const { Stimulus } = require("../models");

class StimuliController {
    static async uploadStimuli(req, res) {
        try {
            const { stimulifile } = req.body;
            const questionId = req.question.id;

            const stimuli = new Stimulus({
                stimulifile,
                owner: questionId
            });

            await stimuli.save();

            res.status(201).json({ message: "Stimuli uploaded successfully", stimuli });
        } catch(error) {
            console.error("Stimuli Upload Error: ", error);
            res.status(500).json({ message: "Server error", error: error.message });
        }
    }
}

module.exports = StimuliController;