const { Schema } = require('mongoose');

module.exports = (Question) => {
  Question.discriminator('multiple_choice', new Schema({
    choices: [{ type: String, required: true }]
  }));
};
