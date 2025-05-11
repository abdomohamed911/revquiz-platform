import QuestionModel from "./model";
import UserModel from "../User/model";
import { QuizModel } from "../Quiz/model";
import ApiError from "@/common/utils/api/ApiError";
import ApiSuccess from "@/common/utils/api/ApiSuccess";

export const questionService = {
  async solveQuestion({
    id,
    answer,
    user,
  }: {
    id: string;
    answer: string;
    user: any;
  }) {
    if (!user) throw new ApiError("Unauthorized access", "UNAUTHORIZED");
    const question = await QuestionModel.findById(id);
    if (!question) throw new ApiError("Question not found", "NOT_FOUND");
    const normalizedUserAnswer = answer.trim().toLowerCase();
    const matchedOption = question.options.find(
      (opt) => opt.text.trim().toLowerCase() === normalizedUserAnswer
    );
    if (!matchedOption) throw new ApiError("Answer not found", "NOT_FOUND");
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
    return new ApiSuccess("OK", "Question solved successfully", {
      isCorrect,
      question: question.question,
      answer: matchedOption.text,
    });
  },

  async solveAllQuestions({
    quizId,
    answers,
    user,
  }: {
    quizId: string;
    answers: { questionId: string; answer: string }[];
    user: any;
  }) {
    if (!Array.isArray(answers))
      throw new ApiError("Answers must be an array", "BAD_REQUEST");
    const questions = await QuestionModel.find({ quiz: quizId });
    if (!questions || questions.length === 0)
      throw new ApiError("No questions found for this quiz", "NOT_FOUND");
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
          correctAnswer: question.options.find((opt) => opt.isCorrect)?.text,
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
    const totalQuestions = questions.length;
    const percentage = (correctCount / totalQuestions) * 100;
    if (!user) throw new ApiError("Unauthorized access", "UNAUTHORIZED");
    const quizDoc = await QuizModel.findById(quizId);
    const quizName = quizDoc ? quizDoc.name : "Quiz";
    if (percentage >= 50) {
      await UserModel.findByIdAndUpdate(user._id, {
        $inc: { "score.quizzes.passed.count": 1 },
        $push: {
          "score.quizzes.passed.quizzes": [{ id: quizId, name: quizName }],
        },
      });
    } else {
      await UserModel.findByIdAndUpdate(user._id, {
        $inc: { "score.quizzes.failed.count": 1 },
        $push: {
          "score.quizzes.failed.quizzes": [{ id: quizId, name: quizName }],
        },
      });
    }
    return new ApiSuccess("OK", "Quiz solved successfully", {
      totalQuestions,
      correctAnswers: correctCount,
      percentage,
      results,
    });
  },
};
