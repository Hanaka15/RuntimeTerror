const express = require("express");
const ParticipantController = require("../controllers/participant.controller");
const { ensureAuth } = require("../middleware/auth.middleware");

const router = express.Router();

router.post("/:participantId", ParticipantController.submitDemographic);
router.get("/:participantId", ParticipantController.getDemographic);
router.post("/:participantId/answers", ParticipantController.submitAnswer);

module.exports = router;