// adminFetches.js
// Contains all data fetching logic for the Admin Panel (fetch faculties, courses, quizzes, user role)
// Each fetch function is exported for use in AdminPage.js

import {
  fetchFaculties,
  fetchCourses,
  fetchQuizzes,
  fetchUserRole,
} from "../../lib/adminApi";

/**
 * Fetches all faculties, courses, and quizzes for dropdowns.
 * Returns an object: { faculties, courses, quizzes }
 */
export const fetchAllAdminData = async () => {
  const faculties = await fetchFaculties();
  const courses = await fetchCourses();
  const quizzes = await fetchQuizzes();
  return { faculties, courses, quizzes };
};

/**
 * Fetches the user role for admin access check.
 * @param {string} token - JWT token
 * @returns {Promise<string>} - The user role
 */
export const fetchAdminUserRole = async (token) => {
  return await fetchUserRole(token);
};
