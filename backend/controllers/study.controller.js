const researcherModel = require("../models/researcher.model");
const Study = require("../models/study.model");
const { QuestionSchema } = require("../models/study.model");

const sendErrorResponse = (res, status, message, error) => {
  console.error(message, error);
  res.status(status).json({ message, error: error.message });
};

class StudyController {
  // Helper: parse config field safely
  static parseConfig(config) {
    if (typeof config !== 'string') return config || {};
    try {
      return JSON.parse(config);
    } catch {
      return {};
    }
  }

  // Helper: attach uploaded files to questions
  static attachFilesToQuestions(questions, files) {
    if (!files || files.length === 0) return questions;

    files.forEach(file => {
      const match = file.fieldname.match(/^questions\[(\d+)\]\[files\]\[(\d+)\]$/);
      if (!match) return;

      const questionIndex = parseInt(match[1], 10);
      if (!questions[questionIndex]) return;

      if (!Array.isArray(questions[questionIndex].files)) {
        questions[questionIndex].files = [];
      }

      questions[questionIndex].files.push({
        filename: file.filename,
        originalname: file.originalname,
        mimetype: file.mimetype,
        path: file.path,
        size: file.size,
      });
    });

    return questions;
  }

  static async createStudy(req, res) {
    try {
      console.log("Received createStudy request body:", req.body);
      console.log("Received createStudy request files:", req.files);

      const { title, description, consent, demographics, published } = req.body;

      const rawQuestions = req.body.questions || [];
      const questions = Array.isArray(rawQuestions) ? rawQuestions : Object.values(rawQuestions);

      const parsedQuestions = questions.map((q) => {
        let config = {};

        try {
          config = typeof q.config === "string" ? JSON.parse(q.config) : q.config;
        } catch (e) {
          console.warn("Invalid JSON in question config:", q.config);
        }

        return {
          type: q.type,
          question: q.question || "Untitled question",
          config,
          files: [],
        };
      });

      // Attach files to questions
      if (req.files && Array.isArray(req.files)) {
        req.files.forEach((file) => {
          const match = file.fieldname.match(/^questions\[(\d+)\]\[files\]\[\d+\]$/);
          if (match) {
            const questionIndex = parseInt(match[1], 10);
            if (parsedQuestions[questionIndex]) {
              parsedQuestions[questionIndex].files.push({
                url: `/uploads/${file.filename}`,
                description: "", // Can be extended later
              });
            }
          }
        });
      }

      const newStudy = await Study.create({
        ownerId: req.user.id,
        title,
        description,
        consent,
        demographics: demographics ? JSON.parse(demographics) : {},
        published: published === "true" || published === true,
        questions: parsedQuestions,
      });

      return res.status(201).json({
        message: "Study created successfully",
        study: newStudy,
      });
    } catch (error) {
      console.error("Study creation failed:", error);
      return res.status(500).json({
        message: "Failed to create study",
        error: error.message,
      });
    }
  }

  static async getStudies(req, res) {
    const userId = req.user.id;

    try {
      const studies = await Study.find({
        $or: [
          { ownerId: userId },
          { collaborators: { $elemMatch: { researcher: userId } } }
        ]
      })
        .populate('collaborators.researcher', 'username avatar')
        .lean();

      res.json(studies);
    } catch (error) {
      sendErrorResponse(res, 500, "Error fetching accessible studies:", error);
    }
  }

  static async getStudyById(req, res) {
    try {
      const { study_id } = req.params;
      const study = await StudyController.findStudyById(study_id);

      res.status(200).json(study);
    } catch (error) {
      sendErrorResponse(res, 404, "Study not found", error);
    }
  }

  static async updateStudy(req, res) {
    try {
      const { study_id } = req.params;
      const study = await StudyController.findStudyById(study_id);

      const { title, questions, consent, demographics, published } = req.body;

      if (title) study.title = title;
      if (questions) study.questions = questions;
      if (consent) study.consent = consent;
      if (demographics) study.demographics = demographics;

      await study.save();
      res.status(200).json({ message: "Study updated successfully", study });
    } catch (error) {
      sendErrorResponse(res, 500, "Study update error:", error);
    }
  }

  static async deleteStudy(req, res) {
    try {
      const { study_id } = req.params;
      const study = await StudyController.findStudyById(study_id);


      if (study.ownerId !== req.user.id) {
        return res
          .status(403)
          .json({ message: "You are not the owner of this study" });
      }

      await study.remove();
      res.status(200).json({ message: "Study deleted successfully" });
    } catch (error) {
      sendErrorResponse(res, 500, "Unexpected error fetching study", error);
    }
  }
}

module.exports = StudyController;
