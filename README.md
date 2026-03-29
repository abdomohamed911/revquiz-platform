# RevQuiz -- Intelligent Quiz Platform

A full-stack quiz platform designed to help students test and reinforce their knowledge through faculty-specific, course-aligned quizzes with configurable difficulty levels, timed sessions, and detailed score tracking.

## Overview

RevQuiz addresses the gap between lecture material and exam readiness by providing a structured, repeatable testing environment. Students select their faculty and course, choose a difficulty mode, and immediately begin a timed quiz session. Upon completion, they receive a detailed breakdown of their performance, enabling targeted revision of weak areas.

The platform separates concerns cleanly between a React-based frontend and an Express + TypeScript backend with MongoDB persistence, making it straightforward to scale, extend, and maintain.

## Features

- **JWT Authentication** -- Secure login and registration system with token-based session management
- **Faculty and Course Selection** -- Hierarchical organization that maps quizzes to specific academic departments and courses
- **Difficulty Modes** -- Three distinct difficulty tiers (easy, medium, hard) that adjust question complexity and scoring
- **Timed Quiz Sessions** -- Countdown timer that enforces real-world exam conditions and auto-submits on expiry
- **Score Tracking** -- Persistent score history tied to each user account for longitudinal progress monitoring
- **Detailed Results** -- Post-quiz breakdown showing correct answers, incorrect selections, and per-question performance
- **Responsive Interface** -- Fully responsive frontend that works across desktop, tablet, and mobile devices
- **Postman Collection** -- Complete API testing suite included for rapid development and QA workflows

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React, JavaScript |
| Backend | Express, TypeScript |
| Database | MongoDB |
| Authentication | JWT (JSON Web Tokens) |
| API Testing | Postman |

## Architecture

The platform follows a standard three-tier architecture:

```
revquiz-platform/
  client/                 # React frontend
    src/
      components/         # UI components
      pages/              # Route-level views
      services/           # API client layer
      context/            # Auth and app state
  server/                 # Express + TypeScript backend
    src/
      controllers/        # Request handlers
      models/             # Mongoose schemas
      routes/             # Express route definitions
      middleware/         # Auth, validation, error handling
      config/             # Environment and database config
  postman/                # Postman collection for API testing
```

**Data Flow:**

1. The React client authenticates through the login endpoint and stores the JWT
2. Authenticated requests include the token in the Authorization header
3. The backend validates the token via middleware before processing any protected route
4. Quiz data is fetched by faculty and course, filtered by the selected difficulty
5. On submission, answers are evaluated server-side and scores are persisted to MongoDB

## API Endpoints

### Authentication

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Create a new user account |
| POST | `/api/auth/login` | Authenticate and receive a JWT |

### Faculties & Courses

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/faculties` | List all available faculties |
| GET | `/api/faculties/:id/courses` | List courses for a specific faculty |

### Quizzes

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/quizzes?course=:courseId&difficulty=:level` | Fetch quiz questions by course and difficulty |
| POST | `/api/quizzes/:id/submit` | Submit quiz answers for evaluation |

### Scores

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/scores` | Get score history for the authenticated user |
| GET | `/api/scores/:quizId` | Get detailed results for a specific quiz attempt |

## Getting Started

### Prerequisites

- Node.js 18 or later
- MongoDB (local instance or MongoDB Atlas connection string)
- npm or yarn

### Environment Variables

Create a `.env` file in the `server/` directory:

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/revquiz
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=7d
```

### Installation

```bash
git clone https://github.com/abdomohamed911/revquiz-platform.git
cd revquiz-platform
```

Install backend dependencies:

```bash
cd server
npm install
```

Install frontend dependencies:

```bash
cd ../client
npm install
```

### Run Locally

Start the backend server:

```bash
cd server
npm run dev
```

Start the frontend development server:

```bash
cd client
npm start
```

The backend runs on `http://localhost:5000` and the frontend on `http://localhost:3000`.

### API Testing

Import the included Postman collection from the `postman/` directory to test all endpoints. Set the `base_url` variable to `http://localhost:5000` and configure the authentication token after running the login request.

## License

MIT

---

**Abdelrahman Mohamed** | [GitHub](https://github.com/abdomohamed911)
