import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../lib/axios";

function CourseSelectionPage() {
  const navigate = useNavigate();
  const { facultyName } = useParams();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!facultyName) {
      setError("No faculty selected");
      setLoading(false);
      return;
    }
    // Fetch the faculty by name directly from the backend
    api
      .get("/faculties", { params: { name: facultyName } })
      .then((facRes) => {
        const allFaculties = facRes.data.data.data || [];
        const faculty = allFaculties[0];
        if (!faculty) {
          setError("Faculty not found");
          setLoading(false);
          return;
        }
        // Now fetch courses by faculty ID
        api
          .get("/courses", { params: { faculty: faculty._id } })
          .then((res) => {
            setCourses(res.data.data.data || []);
            setLoading(false);
          })
          .catch(() => {
            setError("Failed to load courses");
            setLoading(false);
          });
      })
      .catch(() => {
        setError("Failed to load faculties");
        setLoading(false);
      });
  }, [facultyName]);

  if (loading) return <div>Loading courses...</div>;
  if (error) return <div>{error}</div>;

  const handleCourseSelect = (course) => {
    navigate(
      `/faculties/${encodeURIComponent(
        facultyName
      )}/courses/${encodeURIComponent(course.name)}/difficulty`
    );
  };

  return (
    <div className="page">
      <h2>{facultyName ? `${facultyName} Courses` : "Courses"}</h2>
      <div className="grid">
        {courses.map((course) => (
          <div
            key={course._id}
            className="card"
            onClick={() => handleCourseSelect(course)}
          >
            {course.name}
          </div>
        ))}
      </div>
      <button onClick={() => navigate(-1)}>← Back</button>
    </div>
  );
}

export default CourseSelectionPage;
