const mongoose = require("mongoose");
const { Schema } = mongoose;

const BaseQuestionSchema = new Schema(
  {
    type: {
      type: String,
      required: true,
      enum: ["multiple_choice", "rank", "preference", "slider"],
    },
    question: { type: String, required: true, validate: { validator: function(value) { return value !== null; } } },
  },
  { discriminatorKey: "type", _id: true }
);

const StudySchema = new Schema({
  ownerId: { type: String, required: true },
  name: { type: String, required: true },
  consent: { type: String, required: true, maxlength: 4000 },
  demographics: { type: Object },
  published: { type: Boolean, default: false },
  questions: [BaseQuestionSchema],
  collaborators: [
    {
      researcher: { type: Schema.Types.ObjectId, ref: 'Researcher', required: true },
      role: { type: String, enum: ['viewer', 'editor'], default: 'viewer' },
    }
  ]
});


const Question = StudySchema.path("questions").$embeddedSchemaType.schema;

require("./questions/multiple-choice")(Question);
require("./questions/rank")(Question);
require("./questions/preference")(Question);
require("./questions/slider")(Question);

const Study = mongoose.model("Study", StudySchema);
module.exports = Study;
module.exports.QuestionSchema = Question;