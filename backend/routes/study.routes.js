const express = require("express");
const StudyController = require("../controllers/study.controller");
const { ensureAuth } = require("../middleware/auth.middleware");

const router = express.Router();

router.post("/create", ensureAuth, StudyController.createStudy);
router.get("/all", ensureAuth, StudyController.getAllStudies);
router.get("/:study_id", ensureAuth, StudyController.getStudyById);
router.patch("/:study_id", ensureAuth, StudyController.updateStudy);
router.delete("/:study_id", ensureAuth, StudyController.deleteStudy);

module.exports = router;

