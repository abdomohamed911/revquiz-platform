import baseController from "@/common/controllers/handlers";
import QuestionModel from "./model";
import expressAsyncHandler from "express-async-handler";
import ApiError from "@/common/utils/api/ApiError";
import { body, param } from "express-validator";
import validatorMiddleware from "@/common/middleware/validators/validator";
import ApiSuccess from "@/common/utils/api/ApiSuccess";

export const questionController = {
  ...baseController(QuestionModel),
  solveQuestion: {
    handler: expressAsyncHandler(async (req, res, next) => {
      try {
        const { id } = req.params;
        const { answer } = req.body;

        const question = await QuestionModel.findById(id);
        if (!question) {
          return next(new ApiError("Question not found", "NOT_FOUND"));
        }

        // Normalize answer (trim and lowercase)
        const normalizedUserAnswer = answer.trim().toLowerCase();

        // Find matching option
        const matchedOption = question.options.find(
          (opt) => opt.text.trim().toLowerCase() === normalizedUserAnswer
        );

        if (!matchedOption) {
          return next(new ApiError("Answer not found", "NOT_FOUND"));
        }

        // Send success response
        res.status(200).json(
          new ApiSuccess("OK", "correct answer", {
            isCorrect: matchedOption.isCorrect,
            question: question.question,
            answer: matchedOption.text,
          })
        );
      } catch (error) {
        next(error); // Pass any unexpected errors to the error handler
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
};
export default questionController;
