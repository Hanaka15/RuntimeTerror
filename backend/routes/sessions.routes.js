const express = require("express");
const ParticipantController = require("../controllers/sessions.controller");

const router = express.Router();

router.post("/:participantId", ParticipantController.submitDemographic);
router.post("/:sessionId/answers", ParticipantController.submitAnswer);
router.get("/:participantId", ParticipantController.getStudy);

module.exports = router;