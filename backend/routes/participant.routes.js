const express = require("express");
const ParticipantController = require("../controllers/participant.controller");
const { ensureAuth } = require("../middleware/auth.middleware");

const router = express.Router();

router.get("/init/:participantId", ParticipantController.initSession);
router.post("/submit-participant/:id", ParticipantController.submitParticipantInfo);
router.post("/submit-answer/:id", ParticipantController.submitAnswer);
router.post("/complete-study/:id", ParticipantController.completeStudy);
router.get("/status/:id", ParticipantController.getStatus);

module.exports = router;