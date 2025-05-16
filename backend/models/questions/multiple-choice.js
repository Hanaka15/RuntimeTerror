const { Schema } = require('mongoose');

module.exports = (Question) => {
  Question.discriminator('multiple_choice', new Schema({
    question: { type: String, required: true },
    choices: [{ type: String, required: true }]
  }));
};
