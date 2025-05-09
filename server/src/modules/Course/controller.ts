import baseController from "@/common/controllers/handlers";
import { CourseModel } from "./model";

export const courseController = {
    ...baseController(CourseModel)
}