const { Schema } = require('mongoose');

module.exports = (Question) => {
  Question.discriminator('file_upload', new Schema({
    allowedTypes: {
      type: [String],
      default: ['.jpg', '.jpeg', '.png', '.pdf', '.doc', '.docx']
    },
    maxSize: {
      type: Number,
      default: 5 * 1024 * 1024 // 5MB default
    },
    required: {
      type: Boolean,
      default: false
    }
  }));
};
