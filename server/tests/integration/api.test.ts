import request from "supertest";
import express from "express";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

// Import after dotenv is loaded
import { authRouter } from "@/modules/User/routes";
import facultyRoutes from "@/modules/Faculty/routes";
import courseRoutes from "@/modules/Course/routes";
import quizRoutes from "@/modules/Quiz/routes";
import questionRoutes from "@/modules/Question/routes";
import globalError from "@/common/middleware/globalError";

// Build a test app
function createTestApp() {
  const app = express();
  app.use(express.json());
  app.use("/auth", authRouter);
  app.use("/faculties", facultyRoutes);
  app.use("/courses", courseRoutes);
  app.use("/quizzes", quizRoutes);
  app.use("/questions", questionRoutes);
  app.use(globalError);
  return app;
}

const JWT_SECRET = process.env.JWT_SECRET || "test-secret";
let testApp: express.Application;
let adminToken: string;
let userToken: string;
let facultyId: string;
let courseId: string;
let quizId: string;

const TEST_ADMIN = {
  email: `admin-${Date.now()}@test.com`,
  password: "AdminPass123!",
};

const TEST_USER = {
  email: `user-${Date.now()}@test.com`,
  password: "UserPass123!",
};

beforeAll(async () => {
  testApp = createTestApp();

  // Create admin user directly in DB
  // Pass PLAINTEXT password — the User model pre-save hook handles hashing
  const { UserModel: User } = await import("@/modules/User/model");
  const admin = await User.create({
    email: TEST_ADMIN.email,
    password: TEST_ADMIN.password,
    role: "admin",
  });

  // Create regular user with real DB document so authMiddleware can find it
  const user = await User.create({
    email: TEST_USER.email,
    password: TEST_USER.password,
    role: "user",
  });

  // Generate tokens using real user IDs so authMiddleware can look them up
  adminToken = jwt.sign({ id: admin._id, email: admin.email }, JWT_SECRET, {
    expiresIn: "1h",
  });
  userToken = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, {
    expiresIn: "1h",
  });
});

afterAll(async () => {
  const { UserModel: User } = await import("@/modules/User/model");
  const { FacultyModel } = await import("@/modules/Faculty/model");
  const { CourseModel } = await import("@/modules/Course/model");
  const { QuizModel } = await import("@/modules/Quiz/model");
  const { default: QuestionModel } = await import("@/modules/Question/model");
  await User.deleteMany({ email: { $regex: /test\.com$/ } });
  await FacultyModel.deleteMany({});
  await CourseModel.deleteMany({});
  await QuizModel.deleteMany({});
  await QuestionModel.deleteMany({});
});

describe("Auth API", () => {
  test("POST /auth/signup - creates a new user", async () => {
    const res = await request(testApp).post("/auth/signup").send({
      email: `signup-${Date.now()}@test.com`,
      password: "SignupPass123!",
    });
    expect(res.status).toBe(201);
    // ApiSuccess serializes as { response: { status, ... }, data: { userId, token } }
    expect(res.body.response.status).toBe("success");
    expect(res.body.data.token).toBeDefined();
    expect(res.body.data.userId).toBeDefined();
  });

  test("POST /auth/signup - rejects duplicate email", async () => {
    // Use the SAME email for both requests to actually test duplicate rejection
    const dupEmail = `dup-${Date.now()}@test.com`;
    await request(testApp).post("/auth/signup").send({
      email: dupEmail,
      password: "Pass123!",
    });
    const res = await request(testApp).post("/auth/signup").send({
      email: dupEmail,
      password: "Pass123!",
    });
    // ApiError (via globalError) returns flat: { statusCode, statusMessage, status, message, errors }
    expect(res.status).toBe(409);
    expect(res.body.status).toBe("fail");
  });

  test("POST /auth/signup - rejects missing email", async () => {
    const res = await request(testApp).post("/auth/signup").send({
      password: "Pass123!",
    });
    expect(res.status).toBe(400);
  });

  test("POST /auth/login - returns token for valid credentials", async () => {
    const res = await request(testApp).post("/auth/login").send({
      email: TEST_ADMIN.email,
      password: TEST_ADMIN.password,
    });
    expect(res.status).toBe(200);
    expect(res.body.response.status).toBe("success");
    expect(res.body.data.token).toBeDefined();
    expect(res.body.data.userId).toBeDefined();
  });

  test("POST /auth/login - rejects invalid password", async () => {
    const res = await request(testApp).post("/auth/login").send({
      email: TEST_ADMIN.email,
      password: "wrongpassword",
    });
    expect(res.status).toBe(401);
  });

  test("POST /auth/login - rejects non-existent user", async () => {
    const res = await request(testApp).post("/auth/login").send({
      email: "nonexistent@test.com",
      password: "Pass123!",
    });
    expect(res.status).toBe(401);
  });
});

describe("Faculty API", () => {
  test("GET /faculties - returns list", async () => {
    const res = await request(testApp).get("/faculties");
    expect(res.status).toBe(200);
    expect(res.body.response.status).toBe("success");
    // baseServices.getAll returns { data: [...], pagination: {...} } nested inside ApiSuccess.data
    expect(Array.isArray(res.body.data.data)).toBe(true);
  });

  test("POST /faculties - creates faculty (admin)", async () => {
    const res = await request(testApp)
      .post("/faculties")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ name: `Faculty-${Date.now()}` });
    expect(res.status).toBe(201);
    expect(res.body.response.status).toBe("success");
    expect(res.body.data._id).toBeDefined();
    expect(res.body.data.name).toBeDefined();
    facultyId = res.body.data._id;
  });

  test("POST /faculties - rejects non-admin", async () => {
    const res = await request(testApp)
      .post("/faculties")
      .set("Authorization", `Bearer ${userToken}`)
      .send({ name: "Unauthorized Faculty" });
    // userToken now has a real user ID → authMiddleware succeeds → adminMiddleware rejects
    expect(res.status).toBe(403);
  });

  test("GET /faculties/:id - returns faculty by ID", async () => {
    const res = await request(testApp).get(`/faculties/${facultyId}`);
    expect(res.status).toBe(200);
    // baseController.getOne returns the document directly in data
    expect(res.body.data._id).toBe(facultyId);
  });
});

describe("Course API", () => {
  test("POST /courses - creates course (admin)", async () => {
    const res = await request(testApp)
      .post("/courses")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        name: `Course-${Date.now()}`,
        faculty: facultyId,
      });
    expect(res.status).toBe(201);
    courseId = res.body.data._id;
  });

  test("GET /courses - returns courses", async () => {
    const res = await request(testApp).get("/courses");
    expect(res.status).toBe(200);
  });

  test("GET /courses - filters by faculty", async () => {
    const res = await request(testApp).get(`/courses?faculty=${facultyId}`);
    expect(res.status).toBe(200);
  });
});

describe("Quiz API", () => {
  test("POST /quizzes - creates quiz (admin)", async () => {
    const res = await request(testApp)
      .post("/quizzes")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        name: `Quiz-${Date.now()}`,
        course: courseId,
        difficulty: "easy",
      });
    expect(res.status).toBe(201);
    quizId = res.body.data._id;
  });

  test("GET /quizzes - returns quizzes", async () => {
    const res = await request(testApp).get("/quizzes");
    expect(res.status).toBe(200);
  });

  test("GET /quizzes - filters by course", async () => {
    const res = await request(testApp).get(`/quizzes?course=${courseId}`);
    expect(res.status).toBe(200);
  });
});

describe("Question API", () => {
  let questionId: string;

  test("POST /questions - creates question (admin)", async () => {
    const res = await request(testApp)
      .post("/questions")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        question: "What is 2 + 2?",
        quiz: quizId,
        options: [
          { text: "3", isCorrect: false },
          { text: "4", isCorrect: true },
          { text: "5", isCorrect: false },
          { text: "6", isCorrect: false },
        ],
      });
    expect(res.status).toBe(201);
    questionId = res.body.data._id;
  });

  test("GET /questions - requires auth", async () => {
    const res = await request(testApp).get("/questions");
    expect(res.status).toBe(401);
  });

  test("GET /questions - returns questions with auth", async () => {
    const res = await request(testApp)
      .get(`/questions?quiz=${quizId}`)
      .set("Authorization", `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data.data)).toBe(true);
  });

  test("POST /questions/:id/solve - checks correct answer", async () => {
    const res = await request(testApp)
      .post(`/questions/${questionId}/solve`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ answer: "4" });
    expect(res.status).toBe(200);
    expect(res.body.data.isCorrect).toBe(true);
  });

  test("POST /questions/:id/solve - checks wrong answer", async () => {
    const res = await request(testApp)
      .post(`/questions/${questionId}/solve`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ answer: "3" });
    expect(res.status).toBe(200);
    expect(res.body.data.isCorrect).toBe(false);
  });

  test("POST /questions/quiz/:quizId/solve - solves all questions", async () => {
    // Create another question first
    const qRes = await request(testApp)
      .post("/questions")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        question: "What is 1 + 1?",
        quiz: quizId,
        options: [
          { text: "1", isCorrect: false },
          { text: "2", isCorrect: true },
          { text: "3", isCorrect: false },
        ],
      });

    // The created question's ID is at res.body.data._id (baseController.create returns doc in data)
    const secondQuestionId = qRes.body.data._id;

    const res = await request(testApp)
      .post(`/questions/quiz/${quizId}/solve`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        answers: [
          { questionId, answer: "4" },
          { questionId: secondQuestionId, answer: "2" },
        ],
      });
    expect(res.status).toBe(200);
    expect(res.body.data.totalQuestions).toBe(2);
    expect(res.body.data.correctAnswers).toBe(2);
    expect(res.body.data.percentage).toBe(100);
  });

  test("DELETE /questions/:id - deletes question (admin)", async () => {
    const res = await request(testApp)
      .delete(`/questions/${questionId}`)
      .set("Authorization", `Bearer ${adminToken}`);
    expect([200, 404]).toContain(res.status);
  });
});

describe("404 Handler", () => {
  test("GET /nonexistent - returns 404", async () => {
    const res = await request(testApp).get("/nonexistent");
    expect(res.status).toBe(404);
  });
});
