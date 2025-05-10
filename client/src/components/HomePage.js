import React from "react";
import { useNavigate } from "react-router-dom";

function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-10rem)]">
      <div className="max-w-2xl w-full bg-white rounded-xl shadow-lg p-8 border border-blue-100">
        <div className="flex flex-col items-center mb-6">
          <img src="/aiu-logo.png" alt="AIU Logo" className="h-20 mb-2" />
          <h1 className="text-3xl font-bold text-blue-700 mb-2">
            Welcome to RevQuiz
          </h1>
          <p className="text-blue-600 text-lg font-medium mb-1">
            Alamein International University
          </p>
        </div>
        <p className="text-center text-blue-800 mb-6">
          Start revising your courses based on your faculty &amp; difficulty
          level.
          <br />
          Track your progress, challenge yourself, and improve your knowledge!
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold text-lg hover:bg-blue-700 transition-colors"
            onClick={() => navigate("/faculties")}
          >
            Start Quiz
          </button>
          <button
            className="px-6 py-3 bg-white border border-blue-400 text-blue-700 rounded-lg font-semibold text-lg hover:bg-blue-50 transition-colors"
            onClick={() => navigate("/profile")}
          >
            My Profile
          </button>
        </div>
        <div className="mt-8 text-center text-gray-400 text-xs">
          &copy; {new Date().getFullYear()} RevQuiz | AIU. All rights reserved.
        </div>
      </div>
    </div>
  );
}

export default HomePage;
