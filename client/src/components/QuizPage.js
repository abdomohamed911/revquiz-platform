import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../lib/axios";

function QuizPage() {
  const { faculty, course, difficulty, quiz: quizName } = useParams();
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedId, setSelectedId] = useState(null);
  const [isCorrectAnswer, setIsCorrectAnswer] = useState(null);
  const [answers, setAnswers] = useState([]); // To store all answers for submit
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quizNameState, setQuizNameState] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Check authentication before fetching questions
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
    // Fetch the quiz by name to get its ID
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
        // Now fetch questions by quiz ID
        api
          .get("/questions", {
            params: { quiz: quiz._id },
            headers: { Authorization: `Bearer ${token}` },
          })
          .then((res) => {
            setQuestions(res.data.data.data || []);
            setLoading(false);
          })
          .catch(() => {
            setError("Failed to load questions");
            setLoading(false);
          });
      })
      .catch(() => {
        setError("Failed to load quiz");
        setLoading(false);
      });
  }, [quizName, navigate]);

  const handleAnswer = async (opt) => {
    setSelectedId(opt._id);
    setIsCorrectAnswer(opt.isCorrect);
    // Save answer for later submission
    setAnswers((prev) => [
      ...prev,
      { questionId: questions[current]._id, answer: opt.text },
    ]);
    // Call solve for this question
    try {
      await api.post(
        `/questions/${questions[current]._id}/solve`,
        { answer: opt.text },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
    } catch {}
    if (opt.isCorrect) {
      setScore((prev) => prev + 1);
    }
    setTimeout(() => {
      if (current + 1 < questions.length) {
        setCurrent(current + 1);
        setSelectedId(null);
        setIsCorrectAnswer(null);
      } else {
        // Submit all answers for the quiz
        api
          .post(
            `/questions/quiz/${questions[0]?.quiz || ""}/solve`,
            { answers },
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          )
          .finally(() => {
            navigate(
              `/faculties/${faculty}/courses/${course}/difficulty/${difficulty}/quizzes/${quizName}/results`,
              { state: { score: opt.isCorrect ? score + 1 : score } }
            );
          });
      }
    }, 700);
  };

  if (loading) return <div>Loading questions...</div>;
  if (error) return <div>{error}</div>;

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
      <h2>Question {current + 1}</h2>
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
