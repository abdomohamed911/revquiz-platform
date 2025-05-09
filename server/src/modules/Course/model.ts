import { addSlugMiddleware } from "@/common/middleware/mongoose/addSlugMiddleware";
import mongoose from "mongoose";

const courseSchema = new mongoose.Schema(
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
    faculty: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Faculty",
    },
  },

  {
    timestamps: true,
  }
);
addSlugMiddleware(courseSchema, "name");
export const CourseModel = mongoose.model("Course", courseSchema);