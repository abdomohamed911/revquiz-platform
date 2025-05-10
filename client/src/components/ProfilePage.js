import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../lib/axios";

function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Not authenticated");
      setLoading(false);
      return;
    }
    api
      .get("/users/me", { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => {
        setProfile(res.data.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load profile");
        setLoading(false);
      });
  }, []);

  // Helper to fetch quiz, course, and faculty info for a quiz id
  const handleQuizClick = async (quizId) => {
    try {
      // Get quiz info
      const quizRes = await api.get(`/quizzes/${quizId}`);
      const quiz = quizRes.data.data;
      // Get course info
      const courseRes = await api.get(`/courses/${quiz.course}`);
      const course = courseRes.data.data;
      // Get faculty info
      const facultyRes = await api.get(`/faculties/${course.faculty}`);
      const faculty = facultyRes.data.data;
      // Navigate to quiz page with all info
      navigate(
        `/faculties/${faculty.name}/courses/${course.name}/difficulty/${quiz.difficulty}/quizzes/${quiz.name}`
      );
    } catch {
      alert("Failed to load quiz details");
    }
  };

  if (loading) return <div>Loading profile...</div>;
  if (error) return <div>{error}</div>;
  if (!profile) return null;

  const { email, score } = profile;
  const passedQuizzes = score.quizzes.passed.quizzes || [];
  const failedQuizzes = score.quizzes.failed.quizzes || [];

  return (
    <div className="page">
      <h2>Profile</h2>
      <div className="mb-4">
        <strong>Email:</strong> {email}
      </div>
      <div className="mb-4">
        <strong>Quiz Results:</strong>
        <div>
          <span className="text-green-600 font-bold">✔ Passed:</span>{" "}
          {score.quizzes.passed.count}
        </div>
        <ul>
          {passedQuizzes.map((q) => (
            <li key={q.id} className="text-green-700">
              <span
                className="underline hover:text-green-900 cursor-pointer"
                onClick={() => handleQuizClick(q.id)}
              >
                {q.name}
              </span>
            </li>
          ))}
        </ul>
        <div>
          <span className="text-red-600 font-bold">✖ Failed:</span>{" "}
          {score.quizzes.failed.count}
        </div>
        <ul>
          {failedQuizzes.map((q) => (
            <li key={q.id} className="text-red-700">
              <span
                className="underline hover:text-red-900 cursor-pointer"
                onClick={() => handleQuizClick(q.id)}
              >
                {q.name}
              </span>
            </li>
          ))}
        </ul>
      </div>
      <div className="mb-4">
        <strong>Question Results:</strong>
        <div>
          <span className="text-green-600 font-bold">✔ Correct:</span>{" "}
          {score.questions.passed.count}
        </div>
        <div>
          <span className="text-red-600 font-bold">✖ Incorrect:</span>{" "}
          {score.questions.failed.count}
        </div>
      </div>
      <div className="mt-6 text-xs text-gray-400">User ID: {profile._id}</div>
    </div>
  );
}

export default ProfilePage;
