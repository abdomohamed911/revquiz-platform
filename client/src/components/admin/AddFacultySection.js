import React from "react";

function AddFacultySection({
  facultyName,
  setFacultyName,
  handleAddFaculty,
  facultyError,
}) {
  return (
    <div className="mb-6">
      <h3 className="font-semibold mb-2">Add Faculty</h3>
      <div>
        <input
          className="border px-2 py-1 mr-2"
          placeholder="Faculty Name"
          value={facultyName}
          onChange={(e) => setFacultyName(e.target.value)}
        />
        <button className="btn-admin" onClick={handleAddFaculty}>
          Add Faculty
        </button>
        {facultyError && (
          <div className="text-red-600 text-sm mt-1">{facultyError}</div>
        )}
      </div>
    </div>
  );
}

export default AddFacultySection;
