const mongoose = require('mongoose');
const { Schema } = mongoose;

module.exports = (StudyModel) => {
  const MultipleChoiceSchema = new Schema({
    choices: [{ type: String, required: true }]
  }, { _id: false });

  StudyModel.discriminators = StudyModel.discriminators || {};
  StudyModel.discriminators['multiple_choice'] = StudyModel.schema.path('questions').schema.discriminator('multiple_choice', MultipleChoiceSchema);
};
