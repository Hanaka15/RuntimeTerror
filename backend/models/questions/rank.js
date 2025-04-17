const mongoose = require('mongoose');
const { Schema } = mongoose;

module.exports = (StudyModel) => {
  const RankSchema = new Schema({
    options: [{ type: String, required: true }]
  }, { _id: false });

  StudyModel.discriminators = StudyModel.discriminators || {};
  StudyModel.discriminators['rank'] = StudyModel.schema.path('questions').schema.discriminator('rank', RankSchema);
};
