const express = require("express");
const StudyController = require("../controllers/study.controller");
const { authenticateToken } = require("../middleware/auth.middleware");

const router = express.Router();

//create
router.post("/", authenticateToken, StudyController.createStudy);

//read
router.get("/", authenticateToken, StudyController.getAllStudies);
router.get("/:id", authenticateToken, StudyController.getStudyById);

//update
router.patch("/:id", authenticateToken, StudyController.updateStudy);

//delete
router.delete("/:id", authenticateToken, StudyController.deleteStudy);


module.exports = router;