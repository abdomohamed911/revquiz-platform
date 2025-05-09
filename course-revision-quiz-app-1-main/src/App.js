import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './components/HomePage';
import FacultySelectionPage from './components/FacultySelectionPage';
import CourseSelectionPage from './components/CourseSelectionPage';
import DifficultySelectionPage from './components/DifficultySelectionPage';
import QuizPage from './components/QuizPage';
import ResultPage from './components/ResultPage';
import './styles/styles.css';

function App() {
  return (
    <Router>
      <Navbar />
      <div className="app-container">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/faculties" element={<FacultySelectionPage />} />
          <Route path="/faculty/:courses" element={<CourseSelectionPage />} />
          <Route path="/difficulty" element={<DifficultySelectionPage />} />
          <Route path="/quiz" element={<QuizPage />} />
          <Route path="/results" element={<ResultPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
