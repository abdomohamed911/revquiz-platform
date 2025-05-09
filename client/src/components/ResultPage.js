import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function ResultPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { score } = location.state || {};

  return (
    <div className="page">
      <h2>Quiz Completed</h2>
      <div className="result">
        <p>Your Score:</p>
        <div className="score-bar">
          <div className="score-fill" style={{ width: `${score * 20}%` }}></div>
        </div>
        <p><strong>{score} / 5</strong></p>
      </div>
      <button onClick={() => navigate('/faculties/business/courses/Marketing/difficulty/Easy/quizzes/quiz1')}>🔁 Try Again</button>
      <button onClick={() => navigate('/')}>🏠 Go Home</button>
    </div>
  );
}

export default ResultPage;
