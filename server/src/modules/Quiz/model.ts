import { addSlugMiddleware } from "@/common/middleware/mongoose/addSlugMiddleware";
import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    slug: {
      type: String,
      trim: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
    },
  },
  { timestamps: true }
);
addSlugMiddleware(schema, "name");
export const QuizModel = mongoose.model("Quiz", schema);
