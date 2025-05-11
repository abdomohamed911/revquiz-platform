import QuestionModel from "./model";
import UserModel from "../User/model";
import { QuizModel } from "../Quiz/model";
import ApiError from "@/common/utils/api/ApiError";
import ApiSuccess from "@/common/utils/api/ApiSuccess";

/**
 * Solves a single question for a user.
 * Validates user authentication, checks the answer, updates user statistics,
 * and returns the result of the question solution.
 * 
 * @param {Object} params - The parameters for solving a question.
 * @param {string} params.id - The ID of the question to solve.
 * @param {string} params.answer - The user's answer to the question.
 * @param {any} params.user - The user object containing user details.
 * @returns {Promise<ApiSuccess>} - A promise that resolves to the result of the question solution.
 * @throws {ApiError} - Throws an error if the user is unauthorized, question is not found, or answer is not found.
 */
async function solveQuestion({
  id,
  answer,
  user,
}: {
  id: string;
  answer: string;
  user: any;
}) {
  // Ensure user is authenticated
  if (!user) throw new ApiError("Unauthorized access", "UNAUTHORIZED");

  // Retrieve the question by ID
  const question = await QuestionModel.findById(id);
  if (!question) throw new ApiError("Question not found", "NOT_FOUND");

  // Normalize the user's answer for case-insensitive comparison
  const normalizedUserAnswer = answer.trim().toLowerCase();

  // Find the matching option for the user's answer
  const matchedOption = question.options.find(
    (opt) => opt.text.trim().toLowerCase() === normalizedUserAnswer
  );
  if (!matchedOption) throw new ApiError("Answer not found", "NOT_FOUND");

  // Determine if the user's answer is correct
  const isCorrect = matchedOption.isCorrect;

  // Update user's statistics based on the correctness of the answer
  await updateUserQuestionStats(user._id, question, isCorrect);

  // Return the result of solving the question
  return new ApiSuccess("OK", "Question solved successfully", {
    isCorrect,
    question: question.question,
    answer: matchedOption.text,
  });
}

/**
 * Updates user statistics for a solved question.
 * Updates the user's score by incrementing passed or failed question counts and
 * adds the question to the user's record.
 * @param {string} userId - The user's MongoDB _id
 * @param {any} question - The question object containing the question's details
 * @param {boolean} isCorrect - Whether the user's answer is correct or not
 */
async function updateUserQuestionStats(
  userId: string,
  question: any,
  isCorrect: boolean
) {
  // If the user's answer is correct, update the user's stats
  // by incrementing the passed question count and adding the question to the user's record
  if (isCorrect) {
    await UserModel.findByIdAndUpdate(userId, {
      $inc: { "score.questions.passed.count": 1 },
      $push: {
        "score.questions.passed.questions": {
          id: question._id,
          text: question.question,
        },
      },
    });
  } else {
    // If the user's answer is incorrect, update the user's stats
    // by incrementing the failed question count and adding the question to the user's record
    await UserModel.findByIdAndUpdate(userId, {
      $inc: { "score.questions.failed.count": 1 },
      $push: {
        "score.questions.failed.questions": {
          id: question._id,
          text: question.question,
        },
      },
    });
  }
}

/**
 * Solves all questions in a quiz for a user.
 * Validates answers, updates user stats, and returns a summary of results.
 * @param {Object} params - { quizId, answers, user }
 * @returns {Promise<ApiSuccess>}
 */
async function solveAllQuestions({
  quizId,
  answers,
  user,
}: {
  quizId: string;
  answers: { questionId: string; answer: string }[];
  user: any;
}): Promise<ApiSuccess> {
  // Validate that answers is an array
  if (!Array.isArray(answers)) {
    throw new ApiError("Answers must be an array", "BAD_REQUEST");
  }

  // Find all questions for the given quizId
  const questions = await QuestionModel.find({ quiz: quizId });
  // If no questions found, throw an error
  if (!questions.length) {
    throw new ApiError("No questions found for this quiz", "NOT_FOUND");
  }

  // Initialize variables to keep track of results
  let correctCount = 0;
  const results = [];
  // Loop through each question in the quiz
  for (const question of questions) {
    // Find the user's answer for this question
    const answerEntry = answers.find(
      (entry) => entry.questionId === question._id.toString()
    );

    // If no answer found, mark it as incorrect
    if (!answerEntry) {
      results.push({
        questionId: question._id,
        question: question.question,
        isCorrect: false,
        correctAnswer: question.options.find((opt) => opt.isCorrect)?.text,
      });
      continue;
    }

    // Normalize the user's answer and check if it matches the correct answer
    const normalizedAnswer = answerEntry.answer.trim().toLowerCase();
    const matchedOption = question.options.find(
      (opt) => opt.text.trim().toLowerCase() === normalizedAnswer
    );

    const isCorrect = !!matchedOption?.isCorrect;
    if (isCorrect) correctCount++;

    // Add the result to the results array
    results.push({
      questionId: question._id,
      question: question.question,
      isCorrect,
      userAnswer: answerEntry.answer,
      correctAnswer: question.options.find((opt) => opt.isCorrect)?.text,
    });
  }

  // Calculate the total questions and score percentage
  const totalQuestions = questions.length;
  const scorePercentage = (correctCount / totalQuestions) * 100;

  // If the user is not logged in, throw an error
  if (!user) {
    throw new ApiError("Unauthorized access", "UNAUTHORIZED");
  }

  // Find the quiz name for the given quizId
  const quiz = await QuizModel.findById(quizId);
  const quizName = quiz ? quiz.name : "Quiz";

  // Update the user's quiz stats
  await updateUserQuizStats(user._id, quizId, quizName, scorePercentage);

  // Return the results
  return new ApiSuccess("OK", "Quiz solved successfully", {
    totalQuestions,
    correctAnswers: correctCount,
    percentage: scorePercentage,
    results,
  });
}

/**
 * Updates user statistics for a solved quiz.
 * Increments passed/failed quiz counts and pushes quiz info to the user's record.
 * Passing is defined as percentage >= 50.
 *
 * @param {string} userId - The user's MongoDB _id
 * @param {string} quizId - The quiz's MongoDB _id
 * @param {string} quizName - The name of the quiz
 * @param {number} percentage - The user's score percentage for the quiz
 *
 * @returns {Promise<void>} - Resolves when the operation completes
 */
async function updateUserQuizStats(
  userId: string,
  quizId: string,
  quizName: string,
  percentage: number
): Promise<void> {
  // If user passed the quiz (>= 50%), increment passed count and add to passed quizzes
  if (percentage >= 50) {
    await UserModel.findByIdAndUpdate(userId, {
      $inc: { "score.quizzes.passed.count": 1 },
      $push: {
        "score.quizzes.passed.quizzes": [{ id: quizId, name: quizName }],
      },
    });
  } else {
    // Otherwise, increment failed count and add to failed quizzes
    await UserModel.findByIdAndUpdate(userId, {
      $inc: { "score.quizzes.failed.count": 1 },
      $push: {
        "score.quizzes.failed.quizzes": [{ id: quizId, name: quizName }],
      },
    });
  }
}

/**
 * Main question service API for quiz/question solving.
 * - solveQuestion: Solve a single question and update user stats
 * - solveAllQuestions: Solve all questions in a quiz and update user stats
 */
export const questionService = {
  solveQuestion,
  solveAllQuestions,
};
