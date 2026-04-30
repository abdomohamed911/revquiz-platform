import mongoose, { Schema } from "mongoose";
import { faker } from "@faker-js/faker";
import { CourseModel } from "@/modules/Course/model";
import { FacultyModel } from "@/modules/Faculty/model";
import { QuizModel } from "@/modules/Quiz/model";
import QuestionModel from "@/modules/Question/model";
import { UserModel } from "@/modules/User/model";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config({ path: "../../.env" });

const MONGODB_URI = process.env.DB_URL || "mongodb://localhost:27017/revquiz";
const DB_NAME = process.env.DB_NAME || "revquiz";

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI, { dbName: DB_NAME });
    console.log("✅ Connected to MongoDB");

    // Clear existing data
    await FacultyModel.deleteMany({});
    await CourseModel.deleteMany({});
    await QuizModel.deleteMany({});
    await QuestionModel.deleteMany({});
    await UserModel.deleteMany({});

    // Seed Users
    for (let u = 0; u < 5; u++) {
      const hashedPassword = await bcrypt.hash("password123", 10); // Default password for all users
      await UserModel.create({
        email: `user${u + 1}@example.com`, // Unique email for each user
        password: hashedPassword,
        score: {
          quizzes: {
            passed: { count: 0, quizzes: [] },
            failed: { count: 0, quizzes: [] },
          },
          questions: {
            passed: { count: 0, questions: [] },
            failed: { count: 0, questions: [] },
          },
        },
      });
    }

    console.log("✅ Users seeded");

    // Seed Faculties, Courses, Quizzes, and Questions
    for (let f = 0; f < 3; f++) {
      const faculty = await FacultyModel.create({
        name: faker.company.name(),
      });

      for (let c = 0; c < 2; c++) {
        const course = await CourseModel.create({
          name: `${faker.commerce.department()}-${faker.string.uuid()}`, // Ensure unique course name
          faculty: faculty._id,
        });

        for (let qz = 0; qz < 2; qz++) {
          const quiz = await QuizModel.create({
            name: `${faker.lorem.words(3)}-${faker.string.uuid()}`,
            course: course._id,
            difficulty: faker.helpers.arrayElement(["easy", "medium", "hard"]),
          });

          for (let q = 0; q < 5; q++) {
            const correctAnswer = faker.word.noun();
            const options = [
              ...Array.from({ length: 3 }, () => ({
                text: faker.word.noun(),
                isCorrect: false,
              })),
              {
                text: correctAnswer,
                isCorrect: true,
              },
            ];

            // Shuffle options
            const shuffled = options.sort(() => 0.5 - Math.random());

            await QuestionModel.create({
              question: faker.lorem.sentence(),
              quiz: quiz._id,
              options: shuffled,
            });
          }
        }
      }
    }

    console.log("✅ Seeding completed");
    process.exit(0);
  } catch (err) {
    console.error("❌ Seeding failed:", err);
    process.exit(1);
  }
}

seed();
