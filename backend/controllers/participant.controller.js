const Participant = require("../models/participant.model");
const Study = require("../models/study.model");
const crypto = require("crypto");

const sendErrorResponse = (res, status, message, error) => {
    console.error(message, error);
    res.status(status).json({ message, error: error.message });
};

class ParticipantController {
    static async findParticipantById(sessionId) {
        const participant = await Participant.findById(sessionId);
        if (!participant) {
            throw new Error("Session not found");
        }
        return participant;
    }

    static async startSession(req, res) {
        try {
            const { quizId } = req.params;
            const { demographics } = req.body;

            const study = await Study.findById(quizId);
            if (!study) {
                return res.status(404).json({ message: "Quiz not found" });
            }

            const participant = await Participant.create({
                studyId: quizId,
                participantId: crypto.randomUUID(),
                demographics: demographics || {},
                answers: [],
            });

            res.status(200).json({
                message: "Session started successfully",
                sessionId: participant._id,
                quiz: study,
            });
        } catch (error) {
            sendErrorResponse(res, 500, "Session creation error:", error);
        }
    }

    static async submitAnswer(req, res) {
        try {
            const { sessionId } = req.params;
            const { answers } = req.body;

            const participant = await ParticipantController.findParticipantById(sessionId);
            participant.answers.push(...answers);
            await participant.save();

            res.status(200).json({ message: "Answers submitted successfully" });
        } catch (error) {
            sendErrorResponse(res, 500, "Answer submission error:", error);
        }
    }
}

module.exports = ParticipantController;
