const { Schema } = require('mongoose');

module.exports = (Question) => {
  Question.discriminator('preference', new Schema({
    pairs: [
      {
        left: { type: String, required: true },
        right: { type: String, required: true }
      }
    ]
  }));
};
