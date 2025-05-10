import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import api from "../lib/axios";

function ResultPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { faculty, course, difficulty, quiz: quizName } = useParams();
  const { score } = location.state || {};
  const [quizResult, setQuizResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch user profile to get quiz results
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Not authenticated");
      setLoading(false);
      return;
    }
    api
      .get("/users/me", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        // Find the quiz result by quizName
        const quizzes = [
          ...(res.data.data.score.quizzes.passed.quizzes || []),
          ...(res.data.data.score.quizzes.failed.quizzes || []),
        ];
        const found = quizzes.find((q) => q.name === quizName);
        setQuizResult(found || null);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load results");
        setLoading(false);
      });
  }, [quizName]);

  if (loading) return <div>Loading results...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="page">
      <h2>Quiz Completed</h2>
      <div className="result">
        <p>
          Quiz Name: <strong>{quizResult?.name || quizName}</strong>
        </p>
        <p>Your Score:</p>
        <div className="score-bar">
          <div className="score-fill" style={{ width: `${score * 20}%` }}></div>
        </div>
        <p>
          <strong>{score} / 5</strong>
        </p>
      </div>
      <button
        onClick={() =>
          navigate(
            `/faculties/${faculty}/courses/${course}/difficulty/${difficulty}/quizzes/${quizName}`
          )
        }
      >
        🔁 Try Again
      </button>
      <button onClick={() => navigate("/")}>🏠 Go Home</button>
    </div>
  );
}

export default ResultPage;
