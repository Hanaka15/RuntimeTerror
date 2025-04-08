const express = require("express");
const StudyController = require("../controllers/study.controller");
const { authenticateToken } = require("../middleware/auth.middleware");

const router = express.Router();

router.post("/create/study", authenticateToken, StudyController.createStudy);
router.get("/create/study", authenticateToken, StudyController.createStudy);
router.patch("/create/study", authenticateToken, StudyController.createStudy);
router.delete("/create/study", authenticateToken, StudyController.createStudy);

module.exports = router;