const mongoose = require('mongoose');
const { Schema } = mongoose;

const AnswerSchema = new Schema({
  questionId: { type: String, required: true },
  response: { type: Object, required: true }
});

const ParticipantSchema = new Schema({
  studyId: { type: String, required: true },
  participantId: { type: String, required: true },
  demographics: { type: Object, required: true },
  answers: [AnswerSchema]
});

module.exports = mongoose.model('Participant', ParticipantSchema);

