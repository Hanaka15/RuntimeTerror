const mongoose = require('mongoose');
const { Schema } = mongoose;

const AnswerSchema = new Schema({
  questionId: { type: String, required: true },
  response: { type: Object, required: true }
});

const ParticipantSchema = new Schema({
  studyId: { type: Schema.Types.ObjectId, ref: 'Study', required: true },
  email: { type: String, required: true },
  demographics: { type: Object },
  totalQuestions: { type: Number, required: true },
  consent: { type: Boolean, required: true, default: false },
  answers: [AnswerSchema]
});

ParticipantSchema.virtual('answerCount').get(async function () {
  return this.answers.length
});

ParticipantSchema.virtual('status').get(async function () {
  if (this.answers.length === 0) {
    return 'not_started';
  }
  if (this.answers.length < this.totalQuestions) {
    return 'in_progress';
  }
  if (this.answers.length >= this.totalQuestions) {
    return 'completed';
  }
});

ParticipantSchema.virtual('completed').get(async function () {
  return this.answers.length >= this.totalQuestions;
});

ParticipantSchema.virtual('currentQuestion').get(async function () {
  return this.answers.length;
});

module.exports = mongoose.model('Participant', ParticipantSchema);