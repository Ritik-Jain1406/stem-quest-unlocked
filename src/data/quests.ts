import { Quest, STEMCategory } from '@/types/stem';

export const DEMO_QUESTS: Quest[] = [
  {
    id: 'physics-basics',
    title: 'Physics Fundamentals',
    description: 'Explore the basic principles of physics through interactive experiments and simulations.',
    category: 'science',
    difficulty: 'beginner',
    xpReward: 500,
    estimatedTime: 45,
    isCompleted: false,
    labs: [
      {
        id: 'gravity-lab',
        title: 'Gravity Simulation',
        description: 'Understand how gravity affects objects of different masses.',
        type: 'simulation',
        isCompleted: false,
        content: {
          instructions: 'Use the simulation to drop objects of different masses and observe how gravity affects them.',
          simulation: {
            type: 'physics',
            parameters: {
              gravity: 9.8,
              objects: ['feather', 'ball', 'rock'],
            },
          },
        },
      },
      {
        id: 'forces-quiz',
        title: 'Forces Quiz',
        description: 'Test your understanding of forces and motion.',
        type: 'quiz',
        isCompleted: false,
        content: {
          instructions: 'Answer the following questions about forces and motion.',
          questions: [
            {
              id: 'q1',
              question: 'What is the acceleration due to gravity on Earth?',
              options: ['9.8 m/s²', '10 m/s²', '8.9 m/s²', '11.2 m/s²'],
              correctAnswer: 0,
              explanation: 'The acceleration due to gravity on Earth is approximately 9.8 m/s².',
            },
            {
              id: 'q2',
              question: 'Which of Newton\'s laws states that for every action, there is an equal and opposite reaction?',
              options: ['First Law', 'Second Law', 'Third Law', 'Fourth Law'],
              correctAnswer: 2,
              explanation: 'Newton\'s Third Law states that for every action, there is an equal and opposite reaction.',
            },
          ],
        },
      },
    ],
  },
  {
    id: 'coding-basics',
    title: 'Programming Fundamentals',
    description: 'Learn the basics of programming with hands-on coding challenges.',
    category: 'technology',
    difficulty: 'beginner',
    xpReward: 400,
    estimatedTime: 60,
    isCompleted: false,
    labs: [
      {
        id: 'hello-world',
        title: 'Hello World',
        description: 'Write your first program that displays "Hello, World!"',
        type: 'coding',
        isCompleted: false,
        content: {
          instructions: 'Write a program that prints "Hello, World!" to the console.',
          code: {
            language: 'javascript',
            starterCode: '// Write your code here\nconsole.log();',
            expectedOutput: 'Hello, World!',
            testCases: [
              {
                input: '',
                expectedOutput: 'Hello, World!',
              },
            ],
          },
        },
      },
      {
        id: 'variables-quiz',
        title: 'Variables and Data Types',
        description: 'Test your knowledge of variables and data types.',
        type: 'quiz',
        isCompleted: false,
        content: {
          instructions: 'Answer questions about variables and data types.',
          questions: [
            {
              id: 'q1',
              question: 'Which of the following is a valid variable name in JavaScript?',
              options: ['123abc', 'my-var', 'myVar', 'var'],
              correctAnswer: 2,
              explanation: 'Variable names in JavaScript can contain letters, digits, underscores, and dollar signs, but cannot start with a digit or contain hyphens.',
            },
          ],
        },
      },
    ],
  },
  {
    id: 'bridge-design',
    title: 'Bridge Engineering',
    description: 'Design and test virtual bridges to understand structural engineering principles.',
    category: 'engineering',
    difficulty: 'intermediate',
    xpReward: 750,
    estimatedTime: 90,
    isCompleted: false,
    labs: [
      {
        id: 'bridge-simulator',
        title: 'Bridge Design Challenge',
        description: 'Design a bridge that can support maximum weight with minimum materials.',
        type: 'simulation',
        isCompleted: false,
        content: {
          instructions: 'Use the bridge designer to create a structure that can support the required load.',
          materials: ['Steel beams', 'Cables', 'Concrete supports'],
          simulation: {
            type: 'physics',
            parameters: {
              maxLoad: 1000,
              budget: 50000,
              span: 100,
            },
          },
        },
      },
    ],
  },
  {
    id: 'algebra-adventure',
    title: 'Algebra Adventure',
    description: 'Solve algebraic equations and explore mathematical relationships.',
    category: 'mathematics',
    difficulty: 'beginner',
    xpReward: 350,
    estimatedTime: 40,
    isCompleted: false,
    labs: [
      {
        id: 'equation-solver',
        title: 'Equation Solving',
        description: 'Practice solving linear equations step by step.',
        type: 'experiment',
        isCompleted: false,
        content: {
          instructions: 'Solve the given equations by applying algebraic operations.',
          steps: [
            'Identify the variable to solve for',
            'Isolate the variable by performing operations on both sides',
            'Simplify and check your answer',
          ],
        },
      },
      {
        id: 'algebra-quiz',
        title: 'Algebra Quiz',
        description: 'Test your algebraic problem-solving skills.',
        type: 'quiz',
        isCompleted: false,
        content: {
          instructions: 'Solve the following algebraic problems.',
          questions: [
            {
              id: 'q1',
              question: 'Solve for x: 2x + 5 = 13',
              options: ['x = 4', 'x = 6', 'x = 8', 'x = 9'],
              correctAnswer: 0,
              explanation: '2x + 5 = 13 → 2x = 8 → x = 4',
            },
          ],
        },
      },
    ],
  },
];