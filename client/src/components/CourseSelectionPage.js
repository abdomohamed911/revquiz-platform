import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const courseData = {
  engineering: ["Computer Science", "Electrical Engineering", "Mechanical Engineering", "Civil Engineering"],
  business: ["Marketing", "Finance", "Accounting", "Management"],
  medicine: ["Anatomy", "Physiology", "Pharmacology", "Pathology"],
  arts: ["History", "Literature", "Philosophy", "Sociology"],
  science: ["Biology", "Chemistry", "Physics", "Mathematics"]
};

function CourseSelectionPage() {
  const { faculty } = useParams();
  const navigate = useNavigate();
  const courses = courseData[faculty] || [];

  const handleCourseSelect = (course) => {
    const formattedCourse = course.replace(/\s+/g, ''); // I just use it to remove spaces from the url
    navigate(`/faculties/${faculty}/courses/${formattedCourse}/difficulty`);
  };

  return (
    <div className="page">
      <h2>{faculty.charAt(0).toUpperCase() + faculty.slice(1)} Courses</h2>
      <div className="grid">
        {courses.map((course, index) => (
          <div key={index} className="card" onClick={() => handleCourseSelect(course)}>
            {course}
          </div>
        ))}
      </div>
      <button onClick={() => navigate(-1)}>← Back</button>
    </div>
  );
}

export default CourseSelectionPage;
