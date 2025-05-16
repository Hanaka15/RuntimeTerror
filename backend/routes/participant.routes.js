const express = require("express");
const ParticipantController = require("../controllers/participant.controller");

const router = express.Router();

router.post("/:studyId", ParticipantController.startSession);
router.post("/:sessionId/answers", ParticipantController.submitAnswer);
router.get("/:participantId", ParticipantController.getStudy);


module.exports = router;