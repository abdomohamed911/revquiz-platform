// adminHandlers.js
// Contains all handler functions for the Admin Panel (add faculty, course, quiz, question, and option change)
// Each handler is exported for use in AdminPage.js

import api from "../../lib/axios";
import {
  resetQuestionOptions,
  handleOptionChange as handleOptionChangeUtil,
} from "../../lib/questionUtils";

/**
 * Handler to add a new faculty.
 */
export const handleAddFaculty = async ({
  facultyName,
  token,
  setFacultyError,
  setSuccessMsg,
  setFacultyName,
  setErrorMsg,
}) => {
  setFacultyError("");
  setSuccessMsg("");
  try {
    await api.post(
      "/faculties",
      { name: facultyName },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setSuccessMsg("Faculty added!");
    setFacultyName("");
  } catch (err) {
    if (err.response?.data?.message?.toLowerCase().includes("forbidden")) {
      setErrorMsg("You are not authorized to perform this action.");
    } else {
      setFacultyError("Failed to add faculty.");
    }
  }
};

/**
 * Handler to add a new course.
 */
export const handleAddCourse = async ({
  courseName,
  courseFaculty,
  token,
  setCourseError,
  setSuccessMsg,
  setCourseName,
  setCourseFaculty,
  setErrorMsg,
}) => {
  setCourseError("");
  setSuccessMsg("");
  try {
    await api.post(
      "/courses",
      { name: courseName, faculty: courseFaculty },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setSuccessMsg("Course added!");
    setCourseName("");
    setCourseFaculty("");
  } catch (err) {
    if (err.response?.data?.message?.toLowerCase().includes("forbidden")) {
      setErrorMsg("You are not authorized to perform this action.");
    } else {
      setCourseError("Failed to add course.");
    }
  }
};

/**
 * Handler to add a new quiz.
 */
export const handleAddQuiz = async ({
  quizName,
  quizCourse,
  quizDifficulty,
  token,
  setQuizError,
  setSuccessMsg,
  setQuizName,
  setQuizCourse,
  setQuizDifficulty,
  setErrorMsg,
}) => {
  setQuizError("");
  setSuccessMsg("");
  try {
    await api.post(
      "/quizzes",
      { name: quizName, course: quizCourse, difficulty: quizDifficulty },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setSuccessMsg("Quiz added!");
    setQuizName("");
    setQuizCourse("");
    setQuizDifficulty("easy");
  } catch (err) {
    if (err.response?.data?.message?.toLowerCase().includes("forbidden")) {
      setErrorMsg("You are not authorized to perform this action.");
    } else {
      setQuizError("Failed to add quiz.");
    }
  }
};

/**
 * Handler to add a new question.
 */
export const handleAddQuestion = async ({
  questionText,
  questionQuiz,
  questionOptions,
  token,
  setQuestionError,
  setSuccessMsg,
  setQuestionText,
  setQuestionQuiz,
  setQuestionOptions,
  setErrorMsg,
}) => {
  setQuestionError("");
  setSuccessMsg("");
  try {
    await api.post(
      "/questions",
      {
        question: questionText,
        quiz: questionQuiz,
        options: questionOptions,
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setSuccessMsg("Question added!");
    setQuestionText("");
    setQuestionQuiz("");
    setQuestionOptions(resetQuestionOptions());
  } catch (err) {
    if (err.response?.data?.message?.toLowerCase().includes("forbidden")) {
      setErrorMsg("You are not authorized to perform this action.");
    } else {
      setQuestionError("Failed to add question.");
    }
  }
};

/**
 * Handler to ensure only one correct answer for options.
 */
export const handleOptionChange = (idx, field, value, setQuestionOptions) => {
  setQuestionOptions((opts) => handleOptionChangeUtil(idx, field, value, opts));
};
