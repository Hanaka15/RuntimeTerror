const { Schema } = require('mongoose');

module.exports = (Question) => {
  Question.discriminator('rank', new Schema({
    items: [{ type: String, required: true }],
    allowTie: { type: Boolean, default: false }
  }));
};
