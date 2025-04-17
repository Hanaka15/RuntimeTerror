const mongoose = require('mongoose');
const { Schema } = mongoose;
const BaseQuestionSchema = require('./question.model');

// Initialize the Study Schema
const StudySchema = new Schema({
  ownerId: { type: String, required: true },
  studyname: { type: String, required: true },
  questions: [BaseQuestionSchema]
});

// Create Study model
const Study = mongoose.model('Study', StudySchema);

require('./questions/multiple-choice')(Study);
require('./questions/rank')(Study);
require('./questions/prefrence')(Study);
require('./questions/slider')(Study);

module.exports = Study;

