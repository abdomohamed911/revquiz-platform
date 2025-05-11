import React from "react";
import { FacultyDropdown, CourseDropdown } from "./AdminDropdowns";

function AddQuizSection({
  quizName,
  setQuizName,
  quizFaculty,
  setQuizFaculty,
  quizCourse,
  setQuizCourse,
  quizDifficulty,
  setQuizDifficulty,
  faculties,
  courses,
  handleAddQuiz,
  quizError,
}) {
  return (
    <div className="mb-6">
      <h3 className="font-semibold mb-2">Add Quiz</h3>
      <div>
        <input
          className="border px-2 py-1 mr-2"
          placeholder="Quiz Name"
          value={quizName}
          onChange={(e) => setQuizName(e.target.value)}
        />
        <FacultyDropdown
          faculties={faculties}
          value={quizFaculty}
          onChange={(e) => {
            setQuizFaculty(e.target.value);
            setQuizCourse("");
          }}
        />
        <CourseDropdown
          courses={courses}
          facultyId={quizFaculty}
          value={quizCourse}
          onChange={(e) => setQuizCourse(e.target.value)}
        />
        <select
          className="border px-2 py-1 mr-2"
          value={quizDifficulty}
          onChange={(e) => setQuizDifficulty(e.target.value)}
        >
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
        <button className="btn-admin" onClick={handleAddQuiz}>
          Add Quiz
        </button>
        {quizError && (
          <div className="text-red-600 text-sm mt-1">{quizError}</div>
        )}
      </div>
    </div>
  );
}

export default AddQuizSection;
