const express = require("express");
const upload = require("multer???");
const Question = require("../models/question");

const router = express.Router();

//Allow upload for up to 6 artifacts at one time (text, image, audio)
router.post("/create-quiz", upload.array("artifacts", 6), async (req, res) => {
    try {
        const { questionId, questionText, correctArtifactIndex, artifactType } = req.body;
        const artifacts = req.files.map((file) => file.path); // Get file path for uploaded files

        const newQuestion = await Question.create({
            questionId,
            questionText,
            artifacts,
            correctArtifactIndex: parseInt(correctArtifactIndex, 10), // correct artifact is an integer
            artifactType,
        });

        res.status(201).json({message: "Quiz created successfully", question: newQuestion});
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error });
    }
})


module.exports = router;