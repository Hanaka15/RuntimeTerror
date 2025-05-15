const express = require("express");
const StudyController = require("../controllers/study.controller");
const { ensureAuth } = require("../middleware/auth.middleware");
const Validator = require("../middleware/validation.middleware")

const router = express.Router();

router.post("/", ensureAuth, StudyController.createStudy);
router.get("/", ensureAuth, StudyController.getStudies);
router.get("/:study_id", ensureAuth, Validator.validateInput, StudyController.getStudyById);
router.patch("/:study_id", ensureAuth, StudyController.updateStudy);
router.delete("/:study_id", ensureAuth, StudyController.deleteStudy);

module.exports = router;