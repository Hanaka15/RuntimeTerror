const { Schema } = require('mongoose');

module.exports = (Question) => {
  Question.discriminator('slider', new Schema({
    min: { type: Number, required: true },
    max: { type: Number, required: true },
    step: { type: Number, default: 1 },
    defaultValue: { type: Number }
  }));
};
