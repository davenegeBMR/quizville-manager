import { User, Question } from '@/types';

// Example users - Note: Only for development and testing purposes
export const mockUsers: User[] = [
  {
    id: '1',
    username: 'admin',
    password: 'admin123', // In a real app, passwords should be hashed
    email: 'admin@example.com', // Added missing email field
    role: 'admin'
  },
  {
    id: '2',
    username: 'student1',
    password: 'student1', // In a real app, passwords should be hashed
    email: 'student1@example.com', // Added missing email field
    role: 'student'
  },
  {
    id: '3',
    username: 'student2',
    password: 'student2', // In a real app, passwords should be hashed
    email: 'student2@example.com', // Added missing email field
    role: 'student'
  }
];

// Example questions
export const mockQuestions: Question[] = [
  {
    id: '1',
    content: 'What is the capital of France?',
    answer: 'Paris',
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    content: 'What is 2 + 2?',
    answer: '4',
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    content: 'What is the highest mountain in the world?',
    answer: 'Mount Everest',
    createdAt: new Date().toISOString(),
  },
];
