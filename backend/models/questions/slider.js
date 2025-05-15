const { Schema } = require('mongoose');

module.exports = (Question) => {
  Question.discriminator('slider', new Schema({
    min: { type: Number, required: true, default: 0 },
    max: { type: Number, required: true, default: 7 },
    step: { type: Number, default: 1 },
    defaultValue: { type: Number }
  }));
};
