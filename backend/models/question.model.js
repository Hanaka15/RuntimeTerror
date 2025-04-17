const mongoose = require('mongoose');
const { Schema } = mongoose;

const BaseQuestionSchema = new Schema(
  {
    type: { type: String, required: true, enum: ['multiple_choice', 'rank', 'preference', 'slider'] },
    question: { type: String, required: true }
  },
  { discriminatorKey: 'type' }
);

module.exports = BaseQuestionSchema;

