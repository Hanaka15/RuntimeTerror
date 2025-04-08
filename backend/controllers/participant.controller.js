const { Participant } = require("../models");

class ParticipantController {
    static async participatingParticipant(req, res) {
        try {
            const { participating } = req.body;
            const tokenId = req.token.id;

            const participant = new Participant({
                participating,
                owner: tokenId
            });

            await participant.save();

            res.status(201).json({ message: "Participated successfully", participant });
        } catch(error) {
            console.error("Participant Error: ", error);
            res.status(500).json({ message: "Server error", error: error.message });
        }
    }
}

module.exports = ParticipantController