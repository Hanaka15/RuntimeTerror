const Participant = require("../models/participant.model");
const Study = require("../models/study.model");

const sendErrorResponse = (res, status, message, error) => {
    console.error(message, error);
    res.status(status).json({ message, error: error.message });
};

class ParticipantController {
    
    static async getDemographic(req, res) {
        try {
            const { participantId } = req.params; 

            const participant = await Participant.findById(participantId);

            if (!participant) {
                return res.status(404).json({ message: "Participant not found" });
            }

            if (participant.consent) {
                return res.status(400).json({ message: "Already consented" });
            }

            res.status(201).json({
                demographics: participant.demographics,
            });
        } catch (error) {
            sendErrorResponse(res, 500, error);
        }
    }

    static async submitDemographic(req, res) {
        try {
            const { participantId } = req.params;
            const { demographic, consent } = req.body;

            const participant = await Participant.findById(participantId);
            console.log(participantId);

            if (!participant || participant.status === "completed") {
                return res.status(404).json({ message: "Invalid participant" });
            }
            if (participant.consent && participant.demographics) {
                return res.status(400).json({ message: "Already consented" });
            }
            if (!participant.consent) {
                return res.status(403).json({ message: "Need consent" });
            }

            const study = await Study.findById(participant.studyId);
            if (!study) {
                return res.status(404).json({ message: "Study not found" });
            }

            participant.demographics = demographic;
            participant.consent = consent;
            await participant.save();

            res.status(201).json({
                study,
            });
        } catch (error) {
            sendErrorResponse(res, 500, error);
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
