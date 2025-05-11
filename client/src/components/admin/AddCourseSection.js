import React from "react";
import { FacultyDropdown } from "./AdminDropdowns";

function AddCourseSection({
  courseName,
  setCourseName,
  courseFaculty,
  setCourseFaculty,
  faculties,
  handleAddCourse,
  courseError,
}) {
  return (
    <div className="mb-6">
      <h3 className="font-semibold mb-2">Add Course</h3>
      <div>
        <input
          className="border px-2 py-1 mr-2"
          placeholder="Course Name"
          value={courseName}
          onChange={(e) => setCourseName(e.target.value)}
        />
        <FacultyDropdown
          faculties={faculties}
          value={courseFaculty}
          onChange={(e) => setCourseFaculty(e.target.value)}
        />
        <button className="btn-admin" onClick={handleAddCourse}>
          Add Course
        </button>
        {courseError && (
          <div className="text-red-600 text-sm mt-1">{courseError}</div>
        )}
      </div>
    </div>
  );
}

export default AddCourseSection;
