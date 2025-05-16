const express = require("express");
const ParticipantController = require("../controllers/participant.controller");

const router = express.Router();

router.post("/:quizId", ParticipantController.startSession);
router.post("/:sessionId/answers", ParticipantController.submitAnswer);


module.exports = router;