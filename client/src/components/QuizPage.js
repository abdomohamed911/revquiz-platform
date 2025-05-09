import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import questions from '../data/questions';

function QuizPage() {
  const { faculty, course, difficulty, quiz } = useParams();
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedId, setSelectedId] = useState(null);
  const [isCorrectAnswer, setIsCorrectAnswer] = useState(null);
  const navigate = useNavigate();

  const handleAnswer = (opt) => {
    setSelectedId(opt.id);
    setIsCorrectAnswer(opt.isCorrect);

    if (opt.isCorrect) {
      setScore(prev => prev + 1);
    }

    setTimeout(() => {
      if (current + 1 < questions.length) {
        setCurrent(current + 1);
        setSelectedId(null);
        setIsCorrectAnswer(null);
      } else {
        navigate(`/faculties/${faculty}/courses/${course}/difficulty/${difficulty}/quizzes/${quiz}/results`, { state: { score: opt.isCorrect ? score + 1 : score } });
      }
    }, 700);
  };

  const progressPercent = ((current + 1) / questions.length) * 100;

  return (
    <div className="page">
      <div style={{
        height: '10px',
        width: '100%',
        background: '#eee',
        marginBottom: '20px',
        borderRadius: '5px',
        overflow: 'hidden'
      }}>
        <div style={{
          height: '100%',
          width: `${progressPercent}%`,
          background: '#007bff',
          transition: 'width 0.3s'
        }}></div>
      </div>

      <h2>Question {current + 1}</h2>
      <p>{questions[current].question}</p>

      <div className="grid">
        {questions[current].options.map((opt) => (
          <div
            key={opt.id}
            className={`card ${selectedId === opt.id 
              ? (opt.isCorrect ? 'correct' : 'incorrect') 
              : ''}`}
            onClick={() => handleAnswer(opt)}
          >
            {opt.text}
          </div>
        ))}
      </div>
    </div>
  );
}

export default QuizPage;
