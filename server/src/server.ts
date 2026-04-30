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

app.use(apiLimiter);
app.use(express.json());

// CORS configuration — allow specific origins in production
const corsOrigin = process.env.CORS_ORIGIN;
if (corsOrigin) {
  const allowedOrigins = corsOrigin.split(',').map((o) => o.trim());
  app.use(
    cors({
      origin: (origin: string | undefined, callback: (err: Error | null, allow: boolean) => void) => {
        // Allow requests with no origin (mobile apps, curl, etc.)
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error('Not allowed by CORS'), false);
        }
      },
      credentials: true,
    })
  );
} else {
  // Development: allow all origins
  app.use(cors({ credentials: true }));
}
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
