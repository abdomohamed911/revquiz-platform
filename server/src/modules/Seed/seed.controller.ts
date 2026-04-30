import expressAsyncHandler from 'express-async-handler';
import { UserModel } from '@/modules/User/model';
import { FacultyModel } from '@/modules/Faculty/model';
import { CourseModel } from '@/modules/Course/model';
import { QuizModel } from '@/modules/Quiz/model';
import QuestionModel from '@/modules/Question/model';

const seedController = expressAsyncHandler(async (req, res) => {
  const authKey = req.headers['x-seed-key'];
  if (authKey !== process.env.SEED_KEY) {
    res.status(403).json({ status: 'fail', message: 'Invalid seed key' });
    return;
  }

  try {
    await FacultyModel.deleteMany({});
    await CourseModel.deleteMany({});
    await QuizModel.deleteMany({});
    await QuestionModel.deleteMany({});

    const admin = await UserModel.findOneAndUpdate(
      { email: 'admin@test.com' },
      { role: 'admin' },
      { new: true }
    );
    if (!admin) {
      res.status(400).json({ status: 'fail', message: 'admin@test.com not found. Sign up first.' });
      return;
    }

    const faculties = await FacultyModel.create([
      { name: 'Faculty of Engineering' },
      { name: 'Faculty of Computer Science' },
      { name: 'Faculty of Business Administration' },
    ]);

    const courses = await CourseModel.create([
      { name: 'Data Structures & Algorithms', faculty: faculties[0]._id },
      { name: 'Digital Logic Design', faculty: faculties[0]._id },
      { name: 'Web Development', faculty: faculties[1]._id },
      { name: 'Machine Learning', faculty: faculties[1]._id },
      { name: 'Financial Accounting', faculty: faculties[2]._id },
      { name: 'Marketing Principles', faculty: faculties[2]._id },
    ]);

    const quizDefs = [
      { name: 'Arrays & Linked Lists Basics', courseIdx: 0, difficulty: 'easy' },
      { name: 'Sorting Algorithms', courseIdx: 0, difficulty: 'medium' },
      { name: 'Boolean Algebra Fundamentals', courseIdx: 1, difficulty: 'easy' },
      { name: 'HTML & CSS Fundamentals', courseIdx: 2, difficulty: 'easy' },
      { name: 'React Components & State', courseIdx: 2, difficulty: 'medium' },
      { name: 'Supervised Learning Concepts', courseIdx: 3, difficulty: 'hard' },
      { name: 'Balance Sheet Basics', courseIdx: 4, difficulty: 'easy' },
      { name: 'The Marketing Mix (4Ps)', courseIdx: 5, difficulty: 'medium' },
    ];

    const quizzes = [];
    for (const qd of quizDefs) {
      const quiz = await QuizModel.create({
        name: qd.name,
        course: courses[qd.courseIdx]._id,
        difficulty: qd.difficulty,
      });
      quizzes.push(quiz);
    }

    const banks: Record<string, { q: string; correct: string; wrong: string[] }[]> = {
      'Arrays & Linked Lists Basics': [
        { q: 'What is the time complexity of accessing an element by index in an array?', correct: 'O(1)', wrong: ['O(n)', 'O(log n)', 'O(n^2)'] },
        { q: 'Which data structure uses nodes and pointers?', correct: 'Linked List', wrong: ['Array', 'Stack', 'Queue'] },
        { q: 'What is the main advantage of a linked list over an array?', correct: 'Dynamic size', wrong: ['Faster random access', 'Less memory usage', 'Cache friendliness'] },
        { q: 'The head pointer in a singly linked list points to which element?', correct: 'The first node', wrong: ['The last node', 'A random node', 'All nodes'] },
        { q: 'What happens when you insert at the beginning of an array?', correct: 'All existing elements shift right', wrong: ['Only the first element changes', 'Nothing shifts', 'Elements shift left'] },
      ],
      'Sorting Algorithms': [
        { q: 'Which sorting algorithm has the best average-case time complexity?', correct: 'Merge Sort - O(n log n)', wrong: ['Bubble Sort - O(n^2)', 'Selection Sort - O(n^2)', 'Insertion Sort - O(n^2)'] },
        { q: 'What is the worst-case time complexity of Quick Sort?', correct: 'O(n^2)', wrong: ['O(n)', 'O(n log n)', 'O(log n)'] },
        { q: 'Which sorting algorithm is stable?', correct: 'Merge Sort', wrong: ['Quick Sort', 'Heap Sort', 'Selection Sort'] },
        { q: 'Bubble Sort in the best case (already sorted array) runs in:', correct: 'O(n)', wrong: ['O(n^2)', 'O(n log n)', 'O(1)'] },
        { q: 'Heap Sort uses which data structure?', correct: 'Binary Heap', wrong: ['Binary Search Tree', 'Linked List', 'Hash Table'] },
      ],
      'Boolean Algebra Fundamentals': [
        { q: 'What is the result of A AND 0?', correct: '0', wrong: ['A', '1', 'Not A'] },
        { q: "De Morgan's theorem states that NOT(A AND B) equals:", correct: '(NOT A) OR (NOT B)', wrong: ['(NOT A) AND (NOT B)', 'A AND B', 'NOT(A OR B)'] },
        { q: 'How many rows does a truth table for 3 variables have?', correct: '8', wrong: ['4', '6', '9'] },
        { q: 'What is A XOR A?', correct: '0', wrong: ['A', '1', 'NOT A'] },
        { q: 'Which gate is known as the universal gate?', correct: 'NAND', wrong: ['AND', 'OR', 'XOR'] },
      ],
      'HTML & CSS Fundamentals': [
        { q: 'Which HTML tag creates a hyperlink?', correct: '<a>', wrong: ['<link>', '<href>', '<url>'] },
        { q: 'What CSS property changes the text color?', correct: 'color', wrong: ['font-color', 'text-color', 'foreground'] },
        { q: 'Which HTML element is used for the largest heading?', correct: '<h1>', wrong: ['<h6>', '<head>', '<header>'] },
        { q: 'What does CSS stand for?', correct: 'Cascading Style Sheets', wrong: ['Creative Style Sheets', 'Computer Style Sheets', 'Colorful Style Sheets'] },
        { q: 'Which CSS property controls the font size?', correct: 'font-size', wrong: ['text-size', 'font-style', 'text-style'] },
      ],
      'React Components & State': [
        { q: 'What hook is used to manage state in a functional component?', correct: 'useState', wrong: ['useEffect', 'useRef', 'useMemo'] },
        { q: 'What is JSX?', correct: 'JavaScript XML syntax extension', wrong: ['A CSS preprocessor', 'A database query language', 'A testing framework'] },
        { q: 'How do you pass data from parent to child component?', correct: 'Props', wrong: ['State', 'Context', 'Refs'] },
        { q: 'Which hook handles side effects?', correct: 'useEffect', wrong: ['useState', 'useContext', 'useReducer'] },
        { q: 'What is the virtual DOM?', correct: 'A lightweight copy of the real DOM', wrong: ['A browser API', 'A CSS framework', 'A server technology'] },
      ],
      'Supervised Learning Concepts': [
        { q: 'Which algorithm is used for classification?', correct: 'Logistic Regression', wrong: ['Linear Regression (for continuous)', 'K-Means Clustering', 'PCA'] },
        { q: 'What is overfitting?', correct: 'Model performs well on training data but poorly on new data', wrong: ['Model is too simple', 'Model runs too fast', 'Model uses too little data'] },
        { q: 'Which metric measures classification accuracy for imbalanced datasets?', correct: 'F1 Score', wrong: ['Accuracy', 'R-squared', 'MSE'] },
        { q: 'What is the purpose of a validation set?', correct: 'Tune hyperparameters and prevent overfitting', wrong: ['Train the model', 'Test final model performance', 'Generate more data'] },
        { q: 'Which technique helps prevent overfitting?', correct: 'Regularization', wrong: ['Adding more features', 'Increasing model complexity', 'Removing validation data'] },
      ],
      'Balance Sheet Basics': [
        { q: 'What is the accounting equation?', correct: 'Assets = Liabilities + Equity', wrong: ['Revenue - Expenses = Profit', 'Assets + Liabilities = Equity', 'Income = Revenue'] },
        { q: 'Which of these is a current asset?', correct: 'Cash', wrong: ['Land', 'Equipment', 'Patents'] },
        { q: 'Accounts Payable is classified as:', correct: 'A current liability', wrong: ['An asset', 'Equity', 'Revenue'] },
        { q: 'What does retained earnings represent?', correct: 'Accumulated profits not distributed as dividends', wrong: ['Cash in the bank', 'Total revenue', 'Owner investments'] },
        { q: 'Depreciation reduces the value of:', correct: 'Fixed assets', wrong: ['Current assets', 'Liabilities', 'Revenue'] },
      ],
      'The Marketing Mix (4Ps)': [
        { q: 'What do the 4Ps stand for?', correct: 'Product, Price, Place, Promotion', wrong: ['Plan, Produce, Price, Profit', 'People, Process, Product, Price', 'Product, Position, Price, Performance'] },
        { q: 'Which P refers to where the product is sold?', correct: 'Place', wrong: ['Price', 'Promotion', 'Product'] },
        { q: 'Penetration pricing means:', correct: 'Setting a low initial price to gain market share', wrong: ['Setting the highest possible price', 'Matching competitor prices', 'Giving products for free'] },
        { q: 'Which P includes advertising and sales promotions?', correct: 'Promotion', wrong: ['Place', 'Price', 'Product'] },
        { q: 'Product differentiation is a strategy to:', correct: 'Make your product stand out from competitors', wrong: ['Lower production costs', 'Reduce advertising spend', 'Increase product quantity'] },
      ],
    };

    let totalQuestions = 0;
    for (const quiz of quizzes) {
      const bank = banks[quiz.name] || [];
      for (const item of bank) {
        const options = [
          ...item.wrong.map((text) => ({ text, isCorrect: false })),
          { text: item.correct, isCorrect: true },
        ];
        for (let i = options.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [options[i], options[j]] = [options[j], options[i]];
        }
        await QuestionModel.create({
          question: item.q,
          quiz: quiz._id,
          options,
        });
        totalQuestions++;
      }
    }

    res.json({
      status: 'success',
      data: {
        adminPromoted: admin.email,
        faculties: faculties.length,
        courses: courses.length,
        quizzes: quizzes.length,
        questions: totalQuestions,
      },
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    res.status(500).json({ status: 'fail', message: msg });
  }
});

export default seedController;
