const mongoose = require("mongoose");

const QuestionSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
  },
  yes: { type: Number, default: 0 },
  no: { type: Number, default: 0 },
});

QuestionSchema.index({content: "text"});

const questionModel = mongoose.model("question", QuestionSchema);

module.exports = questionModel;
