import mongoose from 'mongoose';
import { CourseModel } from '@/modules/Course/model';
import { FacultyModel } from '@/modules/Faculty/model';
import { QuizModel } from '@/modules/Quiz/model';
import QuestionModel from '@/modules/Question/model';
import { UserModel } from '@/modules/User/model';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config({ path: '../../.env' });

// Support MONGODB_URI (Atlas/Railway) and DB_URL + DB_NAME (local)
const MONGODB_URI = process.env.MONGODB_URI || process.env.DB_URL || 'mongodb://localhost:27017';
const DB_NAME = process.env.DB_NAME;

async function seed() {
  try {
    const options: mongoose.ConnectOptions = {};
    if (DB_NAME && !process.env.MONGODB_URI) {
      options.dbName = DB_NAME;
    }

    await mongoose.connect(MONGODB_URI, options);
    console.log('Connected to MongoDB');

    // Clear existing data
    await FacultyModel.deleteMany({});
    await CourseModel.deleteMany({});
    await QuizModel.deleteMany({});
    await QuestionModel.deleteMany({});
    await UserModel.deleteMany({});
    console.log('Cleared existing data');

    // ─── Create specific demo users ───
    const adminPassword = await bcrypt.hash('Admin123!', 10);
    const demoPassword = await bcrypt.hash('Demo123!', 10);

    await UserModel.create({
      email: 'admin@test.com',
      password: adminPassword,
      role: 'admin',
      score: { quizzes: { passed: { count: 0, quizzes: [] }, failed: { count: 0, quizzes: [] } }, questions: { passed: { count: 0, questions: [] }, failed: { count: 0, questions: [] } } },
    });
    console.log('Created admin: admin@test.com / Admin123!');

    await UserModel.create({
      email: 'demo@test.com',
      password: demoPassword,
      role: 'user',
      score: { quizzes: { passed: { count: 0, quizzes: [] }, failed: { count: 0, quizzes: [] } }, questions: { passed: { count: 0, questions: [] }, failed: { count: 0, questions: [] } } },
    });
    console.log('Created demo user: demo@test.com / Demo123!');

    // ─── Seed Faculties (3) ───
    const facultyNames = [
      'Faculty of Engineering',
      'Faculty of Computer Science',
      'Faculty of Business Administration',
    ];

    const faculties = [];
    for (const name of facultyNames) {
      const faculty = await FacultyModel.create({ name });
      faculties.push(faculty);
    }
    console.log(`Created ${faculties.length} faculties`);

    // ─── Seed Courses (2 per faculty = 6 total) ───
    const courseData = [
      { name: 'Data Structures & Algorithms', facultyIndex: 0 },
      { name: 'Digital Logic Design', facultyIndex: 0 },
      { name: 'Web Development', facultyIndex: 1 },
      { name: 'Machine Learning', facultyIndex: 1 },
      { name: 'Financial Accounting', facultyIndex: 2 },
      { name: 'Marketing Principles', facultyIndex: 2 },
    ];

    const courses = [];
    for (const cd of courseData) {
      const course = await CourseModel.create({
        name: cd.name,
        faculty: faculties[cd.facultyIndex]._id,
      });
      courses.push(course);
    }
    console.log(`Created ${courses.length} courses`);

    // ─── Seed Quizzes (1-2 per course, targeting 8+ total) ───
    const quizDefinitions = [
      // Faculty of Engineering
      { name: 'Arrays & Linked Lists Basics', courseIndex: 0, difficulty: 'easy' },
      { name: 'Sorting Algorithms', courseIndex: 0, difficulty: 'medium' },
      { name: 'Boolean Algebra Fundamentals', courseIndex: 1, difficulty: 'easy' },
      // Faculty of Computer Science
      { name: 'HTML & CSS Fundamentals', courseIndex: 2, difficulty: 'easy' },
      { name: 'React Components & State', courseIndex: 2, difficulty: 'medium' },
      { name: 'Supervised Learning Concepts', courseIndex: 3, difficulty: 'hard' },
      // Faculty of Business
      { name: 'Balance Sheet Basics', courseIndex: 4, difficulty: 'easy' },
      { name: 'The Marketing Mix (4Ps)', courseIndex: 5, difficulty: 'medium' },
    ];

    const quizzes = [];
    for (const qd of quizDefinitions) {
      const quiz = await QuizModel.create({
        name: qd.name,
        course: courses[qd.courseIndex]._id,
        difficulty: qd.difficulty,
      });
      quizzes.push(quiz);
    }
    console.log(`Created ${quizzes.length} quizzes`);

    // ─── Seed Questions (5 per quiz = 40+ total) ───
    const questionBanks: Record<string, { question: string; correctAnswer: string; wrongAnswers: string[] }[]> = {
      'Arrays & Linked Lists Basics': [
        { question: 'What is the time complexity of accessing an element by index in an array?', correctAnswer: 'O(1)', wrongAnswers: ['O(n)', 'O(log n)', 'O(n^2)'] },
        { question: 'Which data structure uses nodes and pointers?', correctAnswer: 'Linked List', wrongAnswers: ['Array', 'Stack', 'Queue'] },
        { question: 'What is the main advantage of a linked list over an array?', correctAnswer: 'Dynamic size', wrongAnswers: ['Faster random access', 'Less memory usage', 'Cache friendliness'] },
        { question: 'The head pointer in a singly linked list points to which element?', correctAnswer: 'The first node', wrongAnswers: ['The last node', 'A random node', 'All nodes simultaneously'] },
        { question: 'What happens when you insert at the beginning of an array?', correctAnswer: 'All existing elements shift right', wrongAnswers: ['Only the first element changes', 'Nothing shifts', 'Elements shift left'] },
      ],
      'Sorting Algorithms': [
        { question: 'Which sorting algorithm has the best average-case time complexity?', correctAnswer: 'Merge Sort - O(n log n)', wrongAnswers: ['Bubble Sort - O(n^2)', 'Selection Sort - O(n^2)', 'Insertion Sort - O(n^2)'] },
        { question: 'What is the worst-case time complexity of Quick Sort?', correctAnswer: 'O(n^2)', wrongAnswers: ['O(n)', 'O(n log n)', 'O(log n)'] },
        { question: 'Which sorting algorithm is stable?', correctAnswer: 'Merge Sort', wrongAnswers: ['Quick Sort', 'Heap Sort', 'Selection Sort'] },
        { question: 'Bubble Sort in the best case (already sorted array) runs in:', correctAnswer: 'O(n)', wrongAnswers: ['O(n^2)', 'O(n log n)', 'O(1)'] },
        { question: 'Heap Sort uses which data structure?', correctAnswer: 'Binary Heap', wrongAnswers: ['Binary Search Tree', 'Linked List', 'Hash Table'] },
      ],
      'Boolean Algebra Fundamentals': [
        { question: 'What is the result of A AND 0?', correctAnswer: '0', wrongAnswers: ['A', '1', 'Not A'] },
        { question: 'De Morgan\'s theorem states that NOT(A AND B) equals:', correctAnswer: '(NOT A) OR (NOT B)', wrongAnswers: ['(NOT A) AND (NOT B)', 'A AND B', 'NOT(A OR B)'] },
        { question: 'How many rows does a truth table for 3 variables have?', correctAnswer: '8', wrongAnswers: ['4', '6', '9'] },
        { question: 'What is A XOR A?', correctAnswer: '0', wrongAnswers: ['A', '1', 'NOT A'] },
        { question: 'Which gate is known as the universal gate?', correctAnswer: 'NAND', wrongAnswers: ['AND', 'OR', 'XOR'] },
      ],
      'HTML & CSS Fundamentals': [
        { question: 'Which HTML tag creates a hyperlink?', correctAnswer: '<a>', wrongAnswers: ['<link>', '<href>', '<url>'] },
        { question: 'What CSS property changes the text color?', correctAnswer: 'color', wrongAnswers: ['font-color', 'text-color', 'foreground'] },
        { question: 'Which HTML element is used for the largest heading?', correctAnswer: '<h1>', wrongAnswers: ['<h6>', '<head>', '<header>'] },
        { question: 'What does CSS stand for?', correctAnswer: 'Cascading Style Sheets', wrongAnswers: ['Creative Style Sheets', 'Computer Style Sheets', 'Colorful Style Sheets'] },
        { question: 'Which CSS property controls the font size?', correctAnswer: 'font-size', wrongAnswers: ['text-size', 'font-style', 'text-style'] },
      ],
      'React Components & State': [
        { question: 'What hook is used to manage state in a functional component?', correctAnswer: 'useState', wrongAnswers: ['useEffect', 'useRef', 'useMemo'] },
        { question: 'What is JSX?', correctAnswer: 'JavaScript XML syntax extension', wrongAnswers: ['A CSS preprocessor', 'A database query language', 'A testing framework'] },
        { question: 'How do you pass data from parent to child component?', correctAnswer: 'Props', wrongAnswers: ['State', 'Context', 'Refs'] },
        { question: 'Which hook handles side effects?', correctAnswer: 'useEffect', wrongAnswers: ['useState', 'useContext', 'useReducer'] },
        { question: 'What is the virtual DOM?', correctAnswer: 'A lightweight copy of the real DOM', wrongAnswers: ['A browser API', 'A CSS framework', 'A server technology'] },
      ],
      'Supervised Learning Concepts': [
        { question: 'Which algorithm is used for classification?', correctAnswer: 'Logistic Regression', wrongAnswers: ['Linear Regression (for continuous)', 'K-Means Clustering', 'PCA'] },
        { question: 'What is overfitting?', correctAnswer: 'Model performs well on training data but poorly on new data', wrongAnswers: ['Model is too simple', 'Model runs too fast', 'Model uses too little data'] },
        { question: 'Which metric measures classification accuracy for imbalanced datasets?', correctAnswer: 'F1 Score', wrongAnswers: ['Accuracy', 'R-squared', 'MSE'] },
        { question: 'What is the purpose of a validation set?', correctAnswer: 'Tune hyperparameters and prevent overfitting', wrongAnswers: ['Train the model', 'Test final model performance', 'Generate more data'] },
        { question: 'Which technique helps prevent overfitting?', correctAnswer: 'Regularization', wrongAnswers: ['Adding more features', 'Increasing model complexity', 'Removing validation data'] },
      ],
      'Balance Sheet Basics': [
        { question: 'What is the accounting equation?', correctAnswer: 'Assets = Liabilities + Equity', wrongAnswers: ['Revenue - Expenses = Profit', 'Assets + Liabilities = Equity', 'Income = Revenue'] },
        { question: 'Which of these is a current asset?', correctAnswer: 'Cash', wrongAnswers: ['Land', 'Equipment', 'Patents'] },
        { question: 'Accounts Payable is classified as:', correctAnswer: 'A current liability', wrongAnswers: ['An asset', 'Equity', 'Revenue'] },
        { question: 'What does retained earnings represent?', correctAnswer: 'Accumulated profits not distributed as dividends', wrongAnswers: ['Cash in the bank', 'Total revenue', 'Owner investments'] },
        { question: 'Depreciation reduces the value of:', correctAnswer: 'Fixed assets', wrongAnswers: ['Current assets', 'Liabilities', 'Revenue'] },
      ],
      'The Marketing Mix (4Ps)': [
        { question: 'What do the 4Ps stand for?', correctAnswer: 'Product, Price, Place, Promotion', wrongAnswers: ['Plan, Produce, Price, Profit', 'People, Process, Product, Price', 'Product, Position, Price, Performance'] },
        { question: 'Which P refers to where the product is sold?', correctAnswer: 'Place', wrongAnswers: ['Price', 'Promotion', 'Product'] },
        { question: 'Penetration pricing means:', correctAnswer: 'Setting a low initial price to gain market share', wrongAnswers: ['Setting the highest possible price', 'Matching competitor prices', 'Giving products for free'] },
        { question: 'Which P includes advertising and sales promotions?', correctAnswer: 'Promotion', wrongAnswers: ['Place', 'Price', 'Product'] },
        { question: 'Product differentiation is a strategy to:', correctAnswer: 'Make your product stand out from competitors', wrongAnswers: ['Lower production costs', 'Reduce advertising spend', 'Increase product quantity'] },
      ],
    };

    let totalQuestions = 0;
    for (const quiz of quizzes) {
      const bank = questionBanks[quiz.name] || [];
      for (const item of bank) {
        const options = [
          ...item.wrongAnswers.map((text) => ({ text, isCorrect: false })),
          { text: item.correctAnswer, isCorrect: true },
        ];
        // Shuffle options
        for (let i = options.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [options[i], options[j]] = [options[j], options[i]];
        }

        await QuestionModel.create({
          question: item.question,
          quiz: quiz._id,
          options,
        });
        totalQuestions++;
      }
    }
    console.log(`Created ${totalQuestions} questions across ${quizzes.length} quizzes`);

    console.log('\n=== Seeding Complete ===');
    console.log('Demo users created:');
    console.log('  Admin:  admin@test.com / Admin123!');
    console.log('  Demo:   demo@test.com / Demo123!');
    console.log(`  Faculties: ${faculties.length}`);
    console.log(`  Courses:  ${courses.length}`);
    console.log(`  Quizzes:  ${quizzes.length}`);
    console.log(`  Questions: ${totalQuestions}`);

    process.exit(0);
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exit(1);
  }
}

seed();
