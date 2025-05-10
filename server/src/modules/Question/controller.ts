import baseController from "@/common/controllers/handlers";
import QuestionModel from "./model";
import expressAsyncHandler from "express-async-handler";
import ApiError from "@/common/utils/api/ApiError";
import { body, param } from "express-validator";
import validatorMiddleware from "@/common/middleware/validators/validator";
import ApiSuccess from "@/common/utils/api/ApiSuccess";
import UserModel from "../User/model";

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

        // Access authenticated user info
        const user = req.user; // Authenticated user
        if (!user) {
          return next(new ApiError("Unauthorized access", "UNAUTHORIZED"));
        }

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

        // Update user score
        const isCorrect = matchedOption.isCorrect;
        if (isCorrect) {
          await UserModel.findByIdAndUpdate(user._id, {
            $inc: { "score.questions.passed.count": 1 },
            $push: {
              "score.questions.passed.questions": {
                id: question._id,
                text: question.question,
              },
            },
          });
        } else {
          await UserModel.findByIdAndUpdate(user._id, {
            $inc: { "score.questions.failed.count": 1 },
            $push: {
              "score.questions.failed.questions": {
                id: question._id,
                text: question.question,
              },
            },
          });
        }

        // Send success response
        res.status(200).json(
          new ApiSuccess("OK", "Question solved successfully", {
            isCorrect,
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
  solveAllQuestions: {
    handler: expressAsyncHandler(async (req, res, next) => {
      try {
        const { quizId } = req.params;
        const { answers } = req.body; // Expecting an array of answers

        // Validate input
        if (!Array.isArray(answers)) {
          return next(new ApiError("Answers must be an array", "BAD_REQUEST"));
        }

        // Fetch all questions for the quiz
        const questions = await QuestionModel.find({ quiz: quizId });
        if (!questions || questions.length === 0) {
          return next(
            new ApiError("No questions found for this quiz", "NOT_FOUND")
          );
        }

        // Calculate the result
        let correctCount = 0;
        const results = questions.map((question) => {
          const userAnswer = answers.find(
            (a) => a.questionId === question._id.toString()
          );
          if (!userAnswer) {
            return {
              questionId: question._id,
              question: question.question,
              isCorrect: false,
              correctAnswer: question.options.find((opt) => opt.isCorrect)
                ?.text,
            };
          }

          const normalizedUserAnswer = userAnswer.answer.trim().toLowerCase();
          const matchedOption = question.options.find(
            (opt) => opt.text.trim().toLowerCase() === normalizedUserAnswer
          );

          const isCorrect = matchedOption?.isCorrect || false;
          if (isCorrect) correctCount++;

          return {
            questionId: question._id,
            question: question.question,
            isCorrect,
            userAnswer: userAnswer.answer,
            correctAnswer: question.options.find((opt) => opt.isCorrect)?.text,
          };
        });

        // Calculate percentage
        const totalQuestions = questions.length;
        const percentage = (correctCount / totalQuestions) * 100;

        // Update user score
        const user = req.user as any;
        if (!user) {
          return next(new ApiError("Unauthorized access", "UNAUTHORIZED"));
        }

        // Fetch quiz name
        const QuizModel = require("../Quiz/model").QuizModel;
        const quizDoc = await QuizModel.findById(quizId);
        const quizName = quizDoc ? quizDoc.name : "Quiz";
        if (percentage >= 50) {
          await UserModel.findByIdAndUpdate(user._id, {
            $inc: { "score.quizzes.passed.count": 1 },
            $push: {
              "score.quizzes.passed.quizzes": [
                {
                  id: quizId,
                  name: quizName,
                },
              ],
            },
          });
        } else {
          await UserModel.findByIdAndUpdate(user._id, {
            $inc: { "score.quizzes.failed.count": 1 },
            $push: {
              "score.quizzes.failed.quizzes": [
                {
                  id: quizId,
                  name: quizName,
                },
              ],
            },
          });
        }

        // Update question scores
        await UserModel.findByIdAndUpdate(user._id, {
          $inc: {
            "score.questions.passed.count": correctCount,
            "score.questions.failed.count": totalQuestions - correctCount,
          },
          $push: {
            "score.questions.passed.questions": questions
              .filter((q, i) => results[i].isCorrect)
              .map((q) => ({
                id: q._id,
                text: q.question,
              })),
            "score.questions.failed.questions": questions
              .filter((q, i) => !results[i].isCorrect)
              .map((q) => ({
                id: q._id,
                text: q.question,
              })),
          },
        });

        // Send the result
        res.status(200).json(
          new ApiSuccess("OK", "Quiz solved successfully", {
            totalQuestions,
            correctAnswers: correctCount,
            percentage,
            results,
          })
        );
      } catch (error) {
        next(error); // Pass any unexpected errors to the error handler
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
