import React from 'react';
import { useNavigate } from 'react-router-dom';

function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="page">
      <h1>Welcome to ReviQuiz</h1>
      <p style={{ textAlign: 'center', marginBottom: '30px' }}>
        Start revising your courses based on your faculty & difficulty level.
      </p>
      <button onClick={() => navigate('/faculties')}>Start Quiz</button>
    </div>
  );
}

export default HomePage;
