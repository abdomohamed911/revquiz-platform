import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./components/HomePage";
import FacultySelectionPage from "./components/FacultySelectionPage";
import CourseSelectionPage from "./components/CourseSelectionPage";
import DifficultySelectionPage from "./components/DifficultySelectionPage";
import QuizPage from "./components/QuizPage";
import ResultPage from "./components/ResultPage";
import "./styles/styles.css";
import QuizzesPage from "./components/QuizzesPage";
import LoginPage from "./components/LoginPage";
import SignupPage from "./components/SignupPage";
import ProfilePage from "./components/ProfilePage";
function App() {
  return (
    <Router>
      <Navbar />
      <div className="app-container">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/faculties" element={<FacultySelectionPage />} />
          <Route
            path="/faculties/:facultyName/courses"
            element={<CourseSelectionPage />}
          />
          <Route
            path="/faculties/:faculty/courses/:course/difficulty"
            element={<DifficultySelectionPage />}
          />
          <Route
            path="/faculties/:faculty/courses/:course/difficulty/:difficulty/quizzes/:quiz"
            element={<QuizPage />}
          />
          <Route
            path="/faculties/:faculty/courses/:course/difficulty/:difficulty/quizzes/:quiz/results"
            element={<ResultPage />}
          />
          <Route
            path="/faculties/:facultyName/courses/:courseName/difficulty/:level/quizzes"
            element={<QuizzesPage />}
          />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/profile" element={<ProfilePage/>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
