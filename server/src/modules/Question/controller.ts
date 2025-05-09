import baseController from "@/common/controllers/handlers";
import QuestionModel from "./model";
import expressAsyncHandler from "express-async-handler";
import ApiError from "@/common/utils/api/ApiError";
import { body, param } from "express-validator";
import validatorMiddleware from "@/common/middleware/validators/validator";

export const questionController = {
  ...baseController(QuestionModel),

  solveQuestion: {
    handler: expressAsyncHandler(async (req, res) => {
      const { id } = req.params;
      const { answer } = req.body;

      const question = await QuestionModel.findById(id);
      if (!question) {
        throw new ApiError("Question not found", "NOT_FOUND");
      }

      // Normalize answer (trim and lowercase)
      const normalizedUserAnswer = answer.trim().toLowerCase();

      // Find matching option
      const matchedOption = question.options.find(
        (opt) => opt.text.trim().toLowerCase() === normalizedUserAnswer
      );

      if (!matchedOption) {
        res
          .status(400)
          .json({ isCorrect: false, message: "Invalid answer option" });
        return;
      }

      res.json({ isCorrect: matchedOption.isCorrect });
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
