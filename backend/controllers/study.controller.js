const researcherModel = require("../models/researcher.model");
const Study = require("../models/study.model");
const Participant = require("../models/participant.model");
const { Parser } = require('json2csv');

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

  static async createParticipants(req, res) {
    try {
      const { studyId } = req.params;
      const { emails } = req.body;
      const study = await Study.findById(studyId);
      if (!study) {
        return res.status(404).json({ message: "Study not found" });
      }

      const existingParticipants = await Participant.find({
        studyId,
        email: { $in: emails }
      }).select('email');

      const existingEmails = new Set(existingParticipants.map(p => p.email));

      const newEmails = emails.filter(email => !existingEmails.has(email));

      if (newEmails.length === 0) {
        return res.status(200).json({
          message: "No new participants to add (all emails already exist for this study)",
          participants: []
        });
      }

      const participants = await Participant.insertMany(
        newEmails.map(email => ({
          studyId,
          email,
          totalQuestions: study.questions.length,
          demographics: study.demographics,
          answers: [],
        }))
      );

      res.status(201).json({
        message: "Participants created successfully",
        participants,
      });
    } catch (error) {
      sendErrorResponse(res, 500, "Error creating participants:", error);
    }
  }


  static async getParticipants(req, res) {
    try {
      const { studyId } = req.params;
      const participants = await Participant.find({ studyId }).lean();
      res.status(200).json(participants);
    } catch (error) {
      sendErrorResponse(res, 500, "Error fetching participants:", error);
    }
  }

  static async deleteParticipant(req, res) {
    try {
      const { studyId, participantId } = req.params;
      const participant = await Participant.findOneAndDelete({ _id: participantId, studyId });

      if (!participant) {
        return res.status(404).json({ message: "Participant not found" });
      }

      res.status(200).json({ message: "Participant deleted successfully" });
    }
    catch (error) {
      sendErrorResponse(res, 500, "Error deleting participant:", error);
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

  static async exportParticipantsCSV(req, res) {
    try {
      const { studyId } = req.params;
      const study = await Study.findById(studyId).lean();
      if (!study) {
        return res.status(404).json({ message: "Study not found" });
      }

      const participants = await Participant.find({ studyId }).lean();
      let demographicsFields = [];
      if (Array.isArray(study.demographics)) {
        demographicsFields = study.demographics.map(field => ({
          label: field.label,
          value: row => (row.demographics && (row.demographics[field.label] ?? row.demographics[field.name])) || ''
        }));
      } else if (study.demographics && typeof study.demographics === 'object') {
        demographicsFields = Object.keys(study.demographics).map(key => ({
          label: key,
          value: row => (row.demographics && row.demographics[key]) || ''
        }));
      }

      const questionFields = (study.questions || []).map(q => ({
        label: q.question,
        value: row => {
          const answerObj = (row.answers || []).find(a => a.questionId == q._id.toString());
          if (!answerObj) return '';
          if (typeof answerObj.response === 'object') return JSON.stringify(answerObj.response);
          return answerObj.response;
        }
      }));

      // Consent and Status
      const fields = [
        ...demographicsFields,
        ...questionFields,
        { label: 'Consent', value: row => row.consent ? 'Yes' : 'No' },
        { label: 'Status', value: row => {
          if (!row.answers || row.answers.length === 0) return 'not_started';
          if (row.answers.length < row.totalQuestions) return 'in_progress';
          return 'completed';
        }},
      ];

      const parser = new Parser({ fields });
      const csv = parser.parse(participants);

      res.header('Content-Type', 'text/csv');
      res.attachment(`study_${studyId}_participants.csv`);
      return res.send(csv);
    } catch (error) {
      sendErrorResponse(res, 500, "Error exporting participants as CSV:", error);
    }
  }
}


module.exports = StudyController;
