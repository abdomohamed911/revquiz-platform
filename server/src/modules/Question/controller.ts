import baseController from "@/common/controllers/handlers";
import QuestionModel from "./model";

export const questionController = {
    ...baseController(QuestionModel)
}