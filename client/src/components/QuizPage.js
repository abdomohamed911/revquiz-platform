import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../lib/axios";

function QuizPage() {
  const { faculty, course, difficulty, quiz: quizName } = useParams();
  const [questions, setQuestions] = useState([]);
  const [quizId, setQuizId] = useState(null);
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedId, setSelectedId] = useState(null);
  const [isCorrectAnswer, setIsCorrectAnswer] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quizNameState, setQuizNameState] = useState("");
  const navigate = useNavigate();
  const isSubmitting = useRef(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login", {
        state: {
          redirectTo: window.location.pathname,
          message: "Please login to access the quiz.",
        },
      });
      return;
    }

    api
      .get("/quizzes", { params: { name: quizName } })
      .then((quizRes) => {
        const quiz = (quizRes.data.data.data || [])[0];
        if (!quiz) {
          setError("Quiz not found");
          setLoading(false);
          return;
        }
        setQuizNameState(quiz.name);
        setQuizId(quiz._id);

        return api.get("/questions", {
          params: { quiz: quiz._id },
          headers: { Authorization: `Bearer ${token}` },
        });
      })
      .then((res) => {
        if (res) {
          setQuestions(res.data.data.data || []);
        }
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load quiz");
        setLoading(false);
      });
  }, [quizName, navigate]);

  const handleAnswer = async (opt) => {
    if (isSubmitting.current) return;
    setSelectedId(opt._id);
    setIsCorrectAnswer(opt.isCorrect);

    const currentAnswer = {
      questionId: questions[current]._id,
      answer: opt.text,
    };
    const updatedAnswers = [...answers, currentAnswer];
    setAnswers(updatedAnswers);

    const token = localStorage.getItem("token");
    try {
      await api.post(
        `/questions/${questions[current]._id}/solve`,
        { answer: opt.text },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch {
      // Individual solve failed silently, quiz-level submission handles scoring
    }

    if (opt.isCorrect) {
      setScore((prev) => prev + 1);
    }

    const finalScore = opt.isCorrect ? score + 1 : score;

    setTimeout(() => {
      if (current + 1 < questions.length) {
        setCurrent(current + 1);
        setSelectedId(null);
        setIsCorrectAnswer(null);
      } else {
        isSubmitting.current = true;
        api
          .post(
            `/questions/quiz/${quizId}/solve`,
            { answers: updatedAnswers },
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          )
          .finally(() => {
            navigate(
              `/faculties/${faculty}/courses/${course}/difficulty/${difficulty}/quizzes/${quizName}/results`,
              { state: { score: finalScore, total: questions.length } }
            );
          });
      }
    }, 700);
  };

  if (loading) return <div className="page"><p>Loading questions...</p></div>;
  if (error) return <div className="page"><p>{error}</p></div>;
  if (questions.length === 0) return <div className="page"><p>No questions available for this quiz.</p></div>;

  const progressPercent = ((current + 1) / questions.length) * 100;

  return (
    <div className="page">
      <div
        style={{
          height: "10px",
          width: "100%",
          background: "#eee",
          marginBottom: "20px",
          borderRadius: "5px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${progressPercent}%`,
            background: "#007bff",
            transition: "width 0.3s",
          }}
        ></div>
      </div>
      <h2>Question {current + 1} of {questions.length}</h2>
      <p>{questions[current]?.question}</p>
      <div className="grid">
        {questions[current]?.options.map((opt) => (
          <div
            key={opt._id}
            className={`card ${
              selectedId === opt._id
                ? opt.isCorrect
                  ? "correct"
                  : "incorrect"
                : ""
            }`}
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
