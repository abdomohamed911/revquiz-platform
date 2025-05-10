import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../lib/axios";

function QuizzesPage() {
  const navigate = useNavigate();
  const { facultyName, courseName, level } = useParams();
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!facultyName || !courseName || !level) {
      setError("Missing parameters");
      setLoading(false);
      return;
    }
    // Fetch the course by name to get its ID
    api
      .get("/courses", { params: { name: courseName } })
      .then((courseRes) => {
        const allCourses = courseRes.data.data.data || [];
        const course = allCourses[0];
        if (!course) {
          setError("Course not found");
          setLoading(false);
          return;
        }
        // Fetch quizzes by course ID and difficulty
        api
          .get("/quizzes", {
            params: { course: course._id, difficulty: level.toLowerCase() },
          })
          .then((quizRes) => {
            setQuizzes(quizRes.data.data.data || []);
            setLoading(false);
          })
          .catch(() => {
            setError("Failed to load quizzes");
            setLoading(false);
          });
      })
      .catch(() => {
        setError("Failed to load course");
        setLoading(false);
      });
  }, [facultyName, courseName, level]);

  if (loading) return <div>Loading quizzes...</div>;
  if (error) return <div>{error}</div>;

  const handleQuizSelect = (quiz) => {
    navigate(
      `/faculties/${facultyName}/courses/${courseName}/difficulty/${level}/quizzes/${quiz._id}`
    );
  };

  return (
    <div className="page">
      <h2>
        {courseName} - {level} Quizzes
      </h2>
      <div className="grid">
        {quizzes.map((quiz) => (
          <div
            key={quiz._id}
            className="card"
            onClick={() => handleQuizSelect(quiz)}
          >
            {quiz.name}
          </div>
        ))}
      </div>
      <button onClick={() => navigate(-1)}>← Back</button>
    </div>
  );
}

export default QuizzesPage;
