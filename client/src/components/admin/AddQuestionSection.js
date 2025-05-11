import React from "react";
import {
  FacultyDropdown,
  CourseDropdown,
  QuizDropdown,
} from "./AdminDropdowns";

function AddQuestionSection({
  questionText,
  setQuestionText,
  questionFaculty,
  setQuestionFaculty,
  faculties,
  questionCourse,
  setQuestionCourse,
  courses,
  questionQuiz,
  setQuestionQuiz,
  quizzes,
  questionOptions,
  handleOptionChange,
  handleAddQuestion,
  questionError,
}) {
  return (
    <div className="mb-6">
      <h3 className="font-semibold mb-2">Add Question</h3>
      <div>
        <input
          className="border px-2 py-1 mr-2"
          placeholder="Question Text"
          value={questionText}
          onChange={(e) => setQuestionText(e.target.value)}
        />
        <FacultyDropdown
          faculties={faculties}
          value={questionFaculty}
          onChange={(e) => {
            setQuestionFaculty(e.target.value);
            setQuestionCourse("");
            setQuestionQuiz("");
          }}
        />
        <CourseDropdown
          courses={courses}
          facultyId={questionFaculty}
          value={questionCourse}
          onChange={(e) => {
            setQuestionCourse(e.target.value);
            setQuestionQuiz("");
          }}
        />
        <QuizDropdown
          quizzes={quizzes}
          courseId={questionCourse}
          value={questionQuiz}
          onChange={(e) => setQuestionQuiz(e.target.value)}
        />
        <div className="mb-2 mt-2">
          {questionOptions.map((opt, idx) => (
            <div key={idx} className="flex items-center mb-1">
              <input
                className="border px-2 py-1 mr-2"
                placeholder={`Option ${idx + 1}`}
                value={opt.text}
                onChange={(e) =>
                  handleOptionChange(idx, "text", e.target.value)
                }
              />
              <input
                type="radio"
                name="correctOption"
                checked={opt.isCorrect}
                onChange={() => handleOptionChange(idx, "isCorrect", "true")}
                className="ml-2 mr-1"
              />
              <span className="text-xs">Correct</span>
            </div>
          ))}
        </div>
        <button className="btn-admin" onClick={handleAddQuestion}>
          Add Question
        </button>
        {questionError && (
          <div className="text-red-600 text-sm mt-1">{questionError}</div>
        )}
      </div>
    </div>
  );
}

export default AddQuestionSection;
