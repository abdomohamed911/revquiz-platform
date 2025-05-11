import baseController from "@/common/controllers/handlers";
import QuestionModel from "./model";
import expressAsyncHandler from "express-async-handler";
import { body, param } from "express-validator";
import validatorMiddleware from "@/common/middleware/validators/validator";
import { questionService } from "./service";

// Extend the Request interface to include the user property
declare global {
  namespace Express {
    interface Request {
      user?: any; // Replace 'any' with the appropriate user type if available
    }
  }
}

export const questionController = {
  ...baseController(QuestionModel),
  solveQuestion: {
    handler: expressAsyncHandler(async (req, res, next) => {
      try {
        const { id } = req.params;
        const { answer } = req.body;
        const user = req.user;
        const result = await questionService.solveQuestion({
          id,
          answer,
          user,
        });
        res.status(200).json(result);
      } catch (error) {
        next(error);
      }
    }),
    validator: [
      param("id")
        .exists()
        .withMessage("Question id is required")
        .isMongoId()
        .withMessage("Invalid question id"),
      body("answer")
        .isString()
        .withMessage("Answer must be a string")
        .trim()
        .notEmpty()
        .withMessage("Answer is required"),
      validatorMiddleware,
    ],
  },
  solveAllQuestions: {
    handler: expressAsyncHandler(async (req, res, next) => {
      try {
        const { quizId } = req.params;
        const { answers } = req.body;
        const user = req.user;
        const result = await questionService.solveAllQuestions({
          quizId,
          answers,
          user,
        });
        res.status(200).json(result);
      } catch (error) {
        next(error);
      }
    }),
    validator: [
      param("quizId")
        .exists()
        .withMessage("Quiz ID is required")
        .isMongoId()
        .withMessage("Invalid Quiz ID"),
      body("answers")
        .isArray()
        .withMessage("Answers must be an array")
        .notEmpty()
        .withMessage("Answers array cannot be empty"),
      body("answers.*.questionId")
        .exists()
        .withMessage("Each answer must have a questionId")
        .isMongoId()
        .withMessage("Invalid questionId"),
      body("answers.*.answer")
        .exists()
        .withMessage("Each answer must have an answer")
        .isString()
        .withMessage("Answer must be a string")
        .trim()
        .notEmpty()
        .withMessage("Answer cannot be empty"),
      validatorMiddleware,
    ],
  },
};
export default questionController;
