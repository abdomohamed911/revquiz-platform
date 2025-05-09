import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';

function DifficultySelectionPage() {
  const navigate = useNavigate();
  const { faculty, course } = useParams();

  const difficulties = [
    { level: "Easy", color: "easy", icon: "🍃" },
    { level: "Medium", color: "medium", icon: "🧩" },
    { level: "Hard", color: "hard", icon: "⚡" }
  ];

  const handleSelect = (level) => {
    navigate(`/faculties/${faculty}/courses/${course}/difficulty/${level}/quizzes/quiz1`);
  };

  return (
    <div className="page">
      <h2>Select Difficulty</h2>
      <div className="grid">
        {difficulties.map((diff, index) => (
          <div
            key={index}
            className={`card ${diff.color}`}
            onClick={() => handleSelect(diff.level)}
          >
            <div style={{ fontSize: "2rem" }}>{diff.icon}</div>
            <h3>{diff.level}</h3>
          </div>
        ))}
      </div>
      <button onClick={() => navigate(-1)}>← Back</button>
    </div>
  );
}

export default DifficultySelectionPage;
