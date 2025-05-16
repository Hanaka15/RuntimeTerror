const { Schema } = require('mongoose');

module.exports = (Question) => {
  Question.discriminator('ranking', new Schema({
    items: [{ type: String, required: true }],
  }));
};
