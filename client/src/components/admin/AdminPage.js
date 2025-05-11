import React, { useState, useEffect } from "react";
import {
  handleAddFaculty,
  handleAddCourse,
  handleAddQuiz,
  handleAddQuestion,
  handleOptionChange,
} from "./adminHandlers";
import { fetchAllAdminData, fetchAdminUserRole } from "./adminFetches";
import {
  FacultyDropdown,
  CourseDropdown,
  QuizDropdown,
} from "./AdminDropdowns";
import { resetQuestionOptions } from "../../lib/questionUtils";
import AddFacultySection from "./AddFacultySection";
import AddCourseSection from "./AddCourseSection";
import AddQuizSection from "./AddQuizSection";
import AddQuestionSection from "./AddQuestionSection";

function AdminPage() {
  // -------------------- State --------------------
  const [loading, setLoading] = useState(true);
  // Form fields
  const [facultyName, setFacultyName] = useState("");
  const [courseName, setCourseName] = useState("");
  const [courseFaculty, setCourseFaculty] = useState("");
  const [quizName, setQuizName] = useState("");
  const [quizCourse, setQuizCourse] = useState("");
  const [quizDifficulty, setQuizDifficulty] = useState("easy");
  const [quizFaculty, setQuizFaculty] = useState("");
  const [questionText, setQuestionText] = useState("");
  const [questionQuiz, setQuestionQuiz] = useState("");
  const [questionFaculty, setQuestionFaculty] = useState("");
  const [questionCourse, setQuestionCourse] = useState("");
  const [questionOptions, setQuestionOptions] = useState(
    resetQuestionOptions()
  );
  // Error/success messages
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [facultyError, setFacultyError] = useState("");
  const [courseError, setCourseError] = useState("");
  const [quizError, setQuizError] = useState("");
  const [questionError, setQuestionError] = useState("");
  // Auth and data
  const [notAuthorized, setNotAuthorized] = useState(false);
  const [userRole, setUserRole] = useState("");
  const [faculties, setFaculties] = useState([]);
  const [courses, setCourses] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const token = localStorage.getItem("token");
  // -------------------- Handlers --------------------
  // Add Faculty
  const onAddFaculty = () =>
    handleAddFaculty({
      facultyName,
      token,
      setFacultyError,
      setSuccessMsg,
      setFacultyName,
      setErrorMsg,
    });

  // Add Course
  const onAddCourse = () =>
    handleAddCourse({
      courseName,
      courseFaculty,
      token,
      setCourseError,
      setSuccessMsg,
      setCourseName,
      setCourseFaculty,
      setErrorMsg,
    });

  // Add Quiz
  const onAddQuiz = () =>
    handleAddQuiz({
      quizName,
      quizCourse,
      quizDifficulty,
      token,
      setQuizError,
      setSuccessMsg,
      setQuizName,
      setQuizCourse,
      setQuizDifficulty,
      setErrorMsg,
    });

  // Add Question
  const onAddQuestion = () =>
    handleAddQuestion({
      questionText,
      questionQuiz,
      questionOptions,
      token,
      setQuestionError,
      setSuccessMsg,
      setQuestionText,
      setQuestionQuiz,
      setQuestionOptions,
      setErrorMsg,
    });

  // Only one correct answer for options
  const onOptionChange = (idx, field, value) =>
    handleOptionChange(idx, field, value, setQuestionOptions);

  // -------------------- Auth & Data Fetching --------------------
  // Check user role for admin access

  useEffect(() => {
    const fetchRole = async () => {
      try {
        const role = await fetchAdminUserRole(token);
        setUserRole(role);
        if (role !== "admin") {
          setNotAuthorized(true);
          setTimeout(() => {
            window.location.href = "/";
          }, 2000);
        }
      } catch {
        setNotAuthorized(true);
        setTimeout(() => {
          window.location.href = "/";
        }, 2000);
      } finally {
        setLoading(false);
      }
    };
    if (!token) {
      setNotAuthorized(true);
      setLoading(false);
      setTimeout(() => {
        window.location.href = "/";
      }, 2000);
    } else {
      fetchRole();
    }
  }, [token]);

  // Redirect if forbidden error
  useEffect(() => {
    if (errorMsg === "You are not authorized to perform this action.") {
      setNotAuthorized(true);
      setTimeout(() => {
        window.location.href = "/";
      });
    } else {
      setNotAuthorized(false);
    }
  }, [errorMsg]);
  // Fetch all dropdown data on mount or after successful add

  useEffect(() => {
    const fetchData = async () => {
      const { faculties, courses, quizzes } = await fetchAllAdminData();
      setFaculties(faculties);
      setCourses(courses);
      setQuizzes(quizzes);
    };
    fetchData();
  }, [successMsg]);

  // -------------------- Render --------------------
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  if (notAuthorized || userRole !== "admin") {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <div className="text-2xl font-bold text-red-700 mb-2">
          Not Authorized
        </div>
        <div className="text-gray-600">
          You will be redirected to the home page...
        </div>
      </div>
    );
  }

  return (
    <div className="page max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Admin Panel</h2>
      {/* Add Faculty Section */}
      <AddFacultySection
        facultyName={facultyName}
        setFacultyName={setFacultyName}
        handleAddFaculty={onAddFaculty}
        facultyError={facultyError}
      />
      {/* Add Course Section */}
      <AddCourseSection
        courseName={courseName}
        setCourseName={setCourseName}
        courseFaculty={courseFaculty}
        setCourseFaculty={setCourseFaculty}
        faculties={faculties}
        handleAddCourse={onAddCourse}
        courseError={courseError}
      />
      {/* Add Quiz Section */}
      <AddQuizSection
        quizName={quizName}
        setQuizName={setQuizName}
        quizFaculty={quizFaculty}
        setQuizFaculty={setQuizFaculty}
        faculties={faculties}
        quizCourse={quizCourse}
        setQuizCourse={setQuizCourse}
        courses={courses}
        quizDifficulty={quizDifficulty}
        setQuizDifficulty={setQuizDifficulty}
        handleAddQuiz={onAddQuiz}
        quizError={quizError}
      />
      {/* Add Question Section */}
      <AddQuestionSection
        questionText={questionText}
        setQuestionText={setQuestionText}
        questionFaculty={questionFaculty}
        setQuestionFaculty={setQuestionFaculty}
        faculties={faculties}
        questionCourse={questionCourse}
        setQuestionCourse={setQuestionCourse}
        courses={courses}
        questionQuiz={questionQuiz}
        setQuestionQuiz={setQuestionQuiz}
        quizzes={quizzes}
        questionOptions={questionOptions}
        handleOptionChange={onOptionChange}
        handleAddQuestion={onAddQuestion}
        questionError={questionError}
      />
      {/* Global error/success messages */}
      {errorMsg && (
        <div className="mt-4 text-red-700 font-semibold">
          {errorMsg === "You are not authorized to perform this action."
            ? "Not Authorized. Redirecting to home..."
            : errorMsg}
        </div>
      )}
      {successMsg && (
        <div className="mt-4 text-green-700 font-semibold">{successMsg}</div>
      )}
    </div>
  );
}

export default AdminPage;
