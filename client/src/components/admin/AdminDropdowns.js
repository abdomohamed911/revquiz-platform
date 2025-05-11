import React from "react";

export function FacultyDropdown({ faculties, value, onChange, ...props }) {
  return (
    <select
      className="border px-2 py-1 mr-2"
      value={value}
      onChange={onChange}
      {...props}
    >
      <option value="">Select Faculty</option>
      {faculties.map((f) => (
        <option key={f._id} value={f._id}>
          {f.name}
        </option>
      ))}
    </select>
  );
}

export function CourseDropdown({
  courses,
  facultyId,
  value,
  onChange,
  ...props
}) {
  return (
    <select
      className="border px-2 py-1 mr-2"
      value={value}
      onChange={onChange}
      disabled={!facultyId}
      {...props}
    >
      <option value="">Select Course</option>
      {courses
        .filter((c) => c.faculty === facultyId)
        .map((c) => (
          <option key={c._id} value={c._id}>
            {c.name}
          </option>
        ))}
    </select>
  );
}

export function QuizDropdown({ quizzes, courseId, value, onChange, ...props }) {
  return (
    <select
      className="border px-2 py-1 mr-2"
      value={value}
      onChange={onChange}
      disabled={!courseId}
      {...props}
    >
      <option value="">Select Quiz</option>
      {quizzes
        .filter((q) => q.course === courseId)
        .map((q) => (
          <option key={q._id} value={q._id}>
            {q.name}
          </option>
        ))}
    </select>
  );
}
