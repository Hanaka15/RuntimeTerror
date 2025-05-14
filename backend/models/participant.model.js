const mongoose = require('mongoose');
const { Schema } = mongoose;

const AnswerSchema = new Schema({
  questionId: { type: String, required: true },
  response: { type: Object, required: true }
});

const ParticipantSchema = new Schema({
  studyId: { type: Schema.Types.ObjectId, ref: 'Study', required: true },
  demographics: { type: Object, required: true },
  answers: [AnswerSchema]
});

ParticipantSchema.virtual('answerCount').get(async function () {
  return this.answers.length
});

module.exports = mongoose.model('Participant', ParticipantSchema);

