const express = require("express");
const StudyController = require("../controllers/study.controller");
const { ensureAuth } = require("../middleware/auth.middleware");
const upload = require("../middleware/multer.middleware");
const router = express.Router();

router.post("/", upload.any(), ensureAuth, StudyController.createStudy);
router.get("/", ensureAuth, StudyController.getStudies);
router.get("/:study_id", ensureAuth, StudyController.getStudyById);
router.patch("/:study_id", ensureAuth, StudyController.updateStudy);
router.delete("/:study_id", ensureAuth, StudyController.deleteStudy);
router.post("/:studyId/participants", ensureAuth, StudyController.createParticipants);
router.get("/:studyId/participants", ensureAuth, StudyController.getParticipants);
router.delete("/:studyId/participants/:participantId", ensureAuth, StudyController.deleteParticipant);
router.get("/:studyId/participants/export/csv", ensureAuth, StudyController.exportParticipantsCSV);

module.exports = router;