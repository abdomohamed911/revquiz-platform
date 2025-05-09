import baseController from "@/common/controllers/handlers";
import { QuizModel } from "./model";

export const quizController = {
    ...baseController(QuizModel),
}