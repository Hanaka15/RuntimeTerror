const mongoose = require('mongoose');
const { Schema } = mongoose;

module.exports = (StudyModel) => {
  const PreferenceSchema = new Schema({
    optionA: { type: String, required: true },
    optionB: { type: String, required: true }
  }, { _id: false });

  StudyModel.discriminators = StudyModel.discriminators || {};
  StudyModel.discriminators['preference'] = StudyModel.schema.path('questions').schema.discriminator('preference', PreferenceSchema);
};
