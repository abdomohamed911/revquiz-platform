import { addSlugMiddleware } from "@/common/middleware/mongoose/addSlugMiddleware";
import mongoose, { Schema } from "mongoose";

const FacultySchema = new Schema(
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
  },
  {
    timestamps: true,
  }
);
addSlugMiddleware(FacultySchema, "name");
export const FacultyModel = mongoose.model("Faculty", FacultySchema);
