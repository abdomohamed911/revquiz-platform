import baseController from "@/common/controllers/handlers";
import { FacultyModel } from "./model";

export const facultyController = {
    ...baseController(FacultyModel),
}