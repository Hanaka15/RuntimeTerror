const mongoose = require('mongoose');
const { Schema } = mongoose;

module.exports = (StudyModel) => {
  const SliderSchema = new Schema({
    stimulus: { type: String, required: true },
    min: { type: Number, required: true },
    max: { type: Number, required: true },
    step: { type: Number, default: 1 }
  }, { _id: false });

  StudyModel.discriminators = StudyModel.discriminators || {};
  StudyModel.discriminators['slider'] = StudyModel.schema.path('questions').schema.discriminator('slider', SliderSchema);
};
