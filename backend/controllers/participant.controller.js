const Participant = require("../models/participant.model");
const Study = require("../models/study.model");

const sendErrorResponse = (res, status, message, error) => {
    console.error(message, error);
    res.status(status).json({ message, error: error.message });
};

class ParticipantController {
    
    static async getStudy(req, res) {
        try {
            const { participantId } = req.params; 

            const participant = await Participant.findById(participantId);
            console.log(participant, participantId)
            if (!participant || participant.status === "completed") {
                return res.status(404).json({ message: "Invalid participant id" });
            }
            const study = await Study.findById(participant.studyId);
            if (!study) {
                return res.status(404).json({ message: "Study not found" });
            }

            res.status(201).json({
                study
            });
        } catch (error) {
            sendErrorResponse(res, 500, error);
        }
    }

    static async startSession(req, res) {
        try {
            const { studyId } = req.params;
            console.log("Received studyId:", studyId); 
            const { demographics } = req.body;

            const study = await Study.findById(studyId);
            if (!study) {
                return res.status(404).json({ message: "Study not found" });
            }

            const participant = await Participant.create({
                studyId: studyId,
                demographics: demographics || {},
                answers: [],
            });

            res.status(200).json({
                message: "Session started successfully",
                sessionId: participant._id,
                study,
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
