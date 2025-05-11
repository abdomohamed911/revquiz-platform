import mongoose from "mongoose";

const schema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
    trim: true,
  },
  quiz: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Quiz",
  },
  options: [
    {
      text: {
        type: String,
        required: true,
      },
      isCorrect: {
        type: Boolean,
        default: false,
        select: false,
      },
    },
  ],
});
const QuestionModel = mongoose.model("Question", schema);
export default QuestionModel;