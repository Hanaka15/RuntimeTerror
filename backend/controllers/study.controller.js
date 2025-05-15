const researcherModel = require("../models/researcher.model");
const Study = require("../models/study.model");
const { QuestionSchema } = require("../models/study.model");

const sendErrorResponse = (res, status, message, error) => {
  console.error(message, error);
  res.status(status).json({ message, error: error.message });
};

class StudyController {
  static async findStudyById(studyId) {
    const study = await Study.findById(studyId);
    if (!study) {
      throw new Error("Study not found");
    }
    return study;
  }

  static async createStudy(req, res) {
    try {
      const { name, questions, consent, demographics, published } = req.body;

      //  const allowedTypes = Object.keys(QuestionSchema.discriminators || {});

      /*       const normalizeQuestionFields = (q) => {
              const normalized = { ...q };
      
              if (q.type === "slider") {
                if (q.minValue !== undefined) normalized.min = q.minValue;
                if (q.maxValue !== undefined) normalized.max = q.maxValue;
                delete normalized.minValue;
                delete normalized.maxValue;
              }
      
              if (q.type === "rank") {
                if (q.items !== undefined) normalized.items = q.items;
                delete normalized.items;
              }
      
              return normalized;
            } */

      /*       const castedQuestions = questions.map((q) => {
              if (!allowedTypes.includes(q.type)) {
                throw new Error(`Unknown question type: ${q.type}`);
              }
      
              const normalized = normalizeQuestionFields(q);
              return new QuestionSchema.discriminators[q.type](normalized);
            }); */

      const newStudy = await Study.create({
        name,
        ownerId: req.user.id,
        consent,
        demographics,
        questions,
        published: published || false,
      });

      res.status(201).json({ message: "Study created successfully", study: newStudy });
    } catch (error) {
      if (error.name === "ValidationError") {
        return res.status(400).json({ message: "Validation Error", error: error.message });
      }
      sendErrorResponse(res, 500, "Study Creation Error:", error);
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

      const { name, questions, consent, demographics, published } = req.body;

      // Update entire study fields
/*       const { studyname } = req.body;
      if (studyname) study.name = studyname;
      //if (questions) study.questions = questions;  */
      if (name) study.name = name;
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
