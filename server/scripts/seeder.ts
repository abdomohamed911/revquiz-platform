import mongoose, { Schema } from "mongoose";
import { faker } from "@faker-js/faker";
import { CourseModel } from "@/modules/Course/model";
import { FacultyModel } from "@/modules/Faculty/model";
import { QuizModel } from "@/modules/Quiz/model";
import QuestionModel from "@/modules/Question/model";


const MONGODB_URI = "mongodb://localhost:27017/test-revQuiz"; // change as needed

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    await FacultyModel.deleteMany({});
    await CourseModel.deleteMany({});
    await QuizModel.deleteMany({});
    await QuestionModel.deleteMany({});

    for (let f = 0; f < 3; f++) {
      const faculty = await FacultyModel.create({
        name: faker.company.name(),
      });

      for (let c = 0; c < 2; c++) {
        const course = await CourseModel.create({
          name: faker.commerce.department(),
          faculty: faculty._id,
        });

        for (let qz = 0; qz < 2; qz++) {
          const quiz = await QuizModel.create({
            name: faker.lorem.words(3),
            description: faker.lorem.sentence(),
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

            // shuffle
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
