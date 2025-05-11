import api from "./axios";

export async function fetchFaculties() {
  const res = await api.get("/faculties");
  return Array.isArray(res.data.data.data) ? res.data.data.data : [];
}

export async function fetchCourses() {
  const res = await api.get("/courses");
  return Array.isArray(res.data.data.data) ? res.data.data.data : [];
}

export async function fetchQuizzes() {
  const res = await api.get("/quizzes");
  return Array.isArray(res.data.data.data) ? res.data.data.data : [];
}

export async function fetchUserRole(token) {
  const res = await api.get("/users/me", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data.data.role || "";
}
