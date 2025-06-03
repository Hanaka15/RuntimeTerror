const Participant = require("../models/participant.model");
const Study = require("../models/study.model");

const sendErrorResponse = (res, status, message, error) => {
    console.error(message, error);
    res.status(status).json({ message, error: error.message });
};

class ParticipantController {
    static async initSession(req, res) {
        try {
            const { participantId } = req.params;
            const participant = await Participant.findById(participantId);
            if (!participant) {
                return res.status(404).json({ message: "Participant not found" });
            }
            const study = await Study.findById(participant.studyId);
            if (!study) {
                return res.status(404).json({ message: "Study not found" });
            }
            res.status(200).json({
                participant,
                study,
                consent: study.consent,
                demographics: study.demographics,
                currentQuestionIndex: participant.answers.length,
                answers: participant.answers
            });
        } catch (error) {
            sendErrorResponse(res, 500, "Failed to initialize session:", error);
        }
    }

    // POST /submit-participant/:id
    static async submitParticipantInfo(req, res) {
        try {
            const { id } = req.params;
            const { demographics, consentAccepted } = req.body;

            const participant = await Participant.findById(id);
            if (!participant) {
                return res.status(404).json({ message: "Participant not found" });
            }
            if (participant.consent && participant.demographics) {
                return res.status(400).json({ message: "Already consented" });
            }

            participant.demographics = demographics;
            participant.consent = consentAccepted;
            await participant.save();

            res.status(200).json({ message: "Participant info submitted" });
        } catch (error) {
            sendErrorResponse(res, 500, "Failed to submit participant info:", error);
        }
    }

    // POST /submit-answer/:id
    static async submitAnswer(req, res) {
        try {
            const { id } = req.params;
            const { questionId, answer } = req.body;

            const participant = await Participant.findById(id);
            if (!participant) {
                return res.status(404).json({ message: "Participant not found" });
            }
            participant.answers.push({ questionId, response: answer });
            await participant.save();

            res.status(200).json({ message: "Answer submitted", currentQuestionIndex: participant.answers.length });
        } catch (error) {
            sendErrorResponse(res, 500, "Failed to submit answer:", error);
        }
    }

    // POST /complete-study/:id
    static async completeStudy(req, res) {
        try {
            const { id } = req.params;
            const participant = await Participant.findById(id);
            if (!participant) {
                return res.status(404).json({ message: "Participant not found" });
            }
            // Optionally set a completed flag or do other logic here
            // participant.completed = true;
            // await participant.save();
            res.status(200).json({ message: "Study marked as complete" });
        } catch (error) {
            sendErrorResponse(res, 500, "Failed to complete study:", error);
        }
    }

    // GET /status/:id (optional)
    static async getStatus(req, res) {
        try {
            const { id } = req.params;
            const participant = await Participant.findById(id);
            if (!participant) {
                return res.status(404).json({ message: "Participant not found" });
            }
            res.status(200).json({
                currentQuestionIndex: participant.answers.length,
                answers: participant.answers,
                completed: participant.answers.length >= participant.totalQuestions
            });
        } catch (error) {
            sendErrorResponse(res, 500, "Failed to get status:", error);
        }
    }
}

module.exports = ParticipantController;
