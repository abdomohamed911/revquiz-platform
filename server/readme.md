# RevQuiz Backend API Documentation

RevQuiz is a quiz platform backend for Alamein International University (AIU), built with Express.js and TypeScript. This document covers only the backend (server) setup, project structure, API endpoints, and developer reflections.

---

## Table of Contents

- [Features](#features)
- [Project Structure](#project-structure)
- [Installation & Setup](#installation--setup)
- [Environment Variables](#environment-variables)
- [Running the Server](#running-the-server)
- [API Reference](#api-reference)
  - [Auth](#auth)
  - [Users](#users)
  - [Faculties](#faculties)
  - [Courses](#courses)
  - [Quizzes](#quizzes)
  - [Questions](#questions)
- [Postman API Collection](#postman-api-collection)
- [Reflections & Key Learnings](#reflections--key-learnings)
  - [What I Learned](#what-i-learned)
  - [What Makes This Project Good](#what-makes-this-project-good)
- [Tech Stack](#tech-stack)
- [Notes](#notes)

---

## Features

- User registration and login (JWT authentication)
- Browse faculties, courses, and quizzes
- Take quizzes and solve questions
- Track user scores and quiz results

---

## Project Structure

```
server/
├── src/
│   ├── modules/         # Feature modules (User, Faculty, Course, Quiz, Question)
│   ├── common/          # Shared utilities, middleware, config
│   ├── server.ts        # Entry point
├── postman.json         # API documentation (importable to Postman)
├── package.json         # Dependencies and scripts
├── tsconfig.json        # TypeScript config
├── nodemon.json         # Nodemon config
```

---

## Installation & Setup

### 1. Clone the Repository

```powershell
git clone <repo-url>
cd RevQuiz/server
```

### 2. Install Dependencies

```powershell
pnpm install
```

---

## Environment Variables

Create a `.env` file in the `server/` directory:

```
PORT=5000
NODE_ENV=development
DATABASE_URL=mongodb://localhost:27017/revquiz
JWT_SECRET=your_super_secret_key
```

---

## Running the Server

```powershell
pnpm dev
```

- The server will run on `http://localhost:5000` by default.

---

## API Reference

All endpoints are prefixed with `http://localhost:5000/`.

### Auth

#### Register

- **POST** `/auth/signup`
- **Body:** `{ "email": "user@example.com", "password": "password123" }`
- **Response:** `{ status, message, data: { userId, token } }`

#### Login

- **POST** `/auth/login`
- **Body:** `{ "email": "user@example.com", "password": "password123" }`
- **Response:** `{ status, message, data: { userId, token } }`

---

### Users

#### Get Profile

- **GET** `/users/me`
- **Headers:** `Authorization: Bearer <token>`
- **Response:** `{ status, message, data: { _id, email, score: { quizzes, questions } } }`

---

### Faculties

#### Get All Faculties

- **GET** `/faculties`
- **Response:** `{ status, message, data: { data: [ { _id, name } ], pagination } }`

#### Create Faculty

- **POST** `/faculties`
- **Body:** `{ "name": "Faculty of Science" }`

---

### Courses

#### Get All Courses

- **GET** `/courses`
- **Body (optional):** `{ "filters": { "faculty": "FACULTY_ID" } }`
- **Response:** List of courses, optionally filtered by faculty.

#### Create Course

- **POST** `/courses`
- **Body:** `{ "name": "Mathematics", "faculty": "FACULTY_ID" }`

---

### Quizzes

#### Get All Quizzes

- **GET** `/quizzes`
- **Body (optional):** `{ "filters": { "course": "COURSE_ID" } }`
- **Response:** List of quizzes, optionally filtered by course.

#### Create Quiz

- **POST** `/quizzes`
- **Body:** `{ "name": "Quiz 1", "course": "COURSE_ID", "difficulty": "easy" }`

---

### Questions

#### Get All Questions

- **GET** `/questions`
- **Body (optional):** `{ "filters": { "quiz": "QUIZ_ID" } }`
- **Response:** List of questions, optionally filtered by quiz.

#### Solve a Question

- **GET** `/questions/:id/solve`
- **Headers:** `Authorization: Bearer <token>`
- **Body:** `{ "answer": "your_answer_here" }`
- **Response:** `{ status, message, data: { isCorrect, question, answer } }`

#### Solve All Questions in a Quiz

- **POST** `/questions/quiz/:quizId/solve`
- **Headers:** `Authorization: Bearer <token>`
- **Body:**
  ```json
  {
    "answers": [
      { "questionId": "QUESTION_ID_1", "answer": "answer1" },
      { "questionId": "QUESTION_ID_2", "answer": "answer2" }
    ]
  }
  ```
- **Response:** `{ status, message, data: { totalQuestions, correctAnswers, percentage, results: [ ... ] } }`

---

## Postman API Collection

A full Postman collection is provided for easy API testing and exploration:

- **File:** `server/postman.json`
- **How to use:**
  1. Open [Postman](https://www.postman.com/downloads/).
  2. Click `Import` and select the `postman.json` file from the `server` folder.
  3. All endpoints, example requests, and responses will be available for you to try out and learn from.

---

## Reflections & Key Learnings

### What I Learned

- How to design and implement a RESTful API using Express.js and TypeScript.
- Structuring a scalable backend project with modular controllers, models, and routes.
- Implementing JWT authentication and protecting routes.
- Using MongoDB with Mongoose for flexible data modeling.
- Writing clear API documentation and providing a Postman collection for easy testing.
- Handling errors and validation in a consistent, user-friendly way.
- Using environment variables and configuration for secure, portable deployment.

### What Makes This Project Good

- **Clean, modular codebase:** Each feature (users, faculties, courses, quizzes, questions) is separated for maintainability.
- **Comprehensive API documentation:** Both in-code and via Postman collection for fast onboarding and testing.
- **Security best practices:** Passwords are hashed, JWT is used for authentication, and protected endpoints are enforced.
- **Consistent error handling:** All errors are returned in a standard JSON format, making debugging and client integration easier.
- **Scalable structure:** The project is ready for new features and can be extended for real-world use.
- **Practical learning:** This project demonstrates real backend skills, from setup to deployment and documentation.

---

## Tech Stack

- **Backend:** Express.js (TypeScript), MongoDB, JWT
- **Dev Tools:** pnpm, Nodemon, ts-node, dotenv

---

## Notes

- All protected endpoints require a valid JWT token in the `Authorization` header.
- For more details and example requests, see the included `postman.json` file.
