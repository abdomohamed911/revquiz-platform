import express, { NextFunction, Request, Response } from 'express';
import dotenv from 'dotenv';
import facultyRouter from './modules/Faculty/routes';
import dbConnection from './common/config/database.config';
import globalError from './common/middleware/globalError';
import ApiError from './common/utils/api/ApiError';
import courseRouter from './modules/Course/routes';
import quizRouter from './modules/Quiz/routes';
import questionRouter from './modules/Question/routes';
import userRouter, { authRouter } from './modules/User/routes';
import cors from 'cors';
import { authLimiter, apiLimiter } from './common/middleware/rateLimiter';
import seedController from './modules/Seed/seed.controller';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Health check endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  res.status(200).json({ ok: true, timestamp: new Date().toISOString() });
});

app.use(apiLimiter);
app.use(express.json());

// CORS configuration — lock down in production, allow all in development
const corsOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',').map((s) => s.trim())
  : undefined;

app.use(
  cors({
    origin: corsOrigins ?? true,
    credentials: true,
  })
);

dbConnection.connect();

app.use('/faculties', facultyRouter);
app.use('/courses', courseRouter);
app.use('/quizzes', quizRouter);
app.use('/questions', questionRouter);
app.use('/users', userRouter);
app.use('/auth', authLimiter, authRouter);
app.post('/seed', seedController);
app.all('*', (req: Request, res: Response, next: NextFunction) => {
  next(new ApiError('Route not found', 'NOT_FOUND'));
});
app.use(globalError);

const server = app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

process.on('unhandledRejection', (err: Error) => {
  console.error(`Internal Server Error: ${err.name} | ${err.message}`);
  console.error('shutting down...');
  server.close(() => process.exit(1));
});
