
import { User, Question } from '@/types';

// Example users - Note: Only for development and testing purposes
export const mockUsers: User[] = [
  {
    id: '1',
    username: 'admin',
    password: 'admin123', // In a real app, passwords should be hashed
    email: 'admin@example.com',
    role: 'admin'
  },
  {
    id: '2',
    username: 'student1',
    password: 'student1', // In a real app, passwords should be hashed
    email: 'student1@example.com',
    role: 'student'
  },
  {
    id: '3',
    username: 'student2',
    password: 'student2', // In a real app, passwords should be hashed
    email: 'student2@example.com',
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

// Function to get all questions
export const getQuestions = (): Question[] => {
  return mockQuestions;
};

// Function to get a specific question by ID
export const getQuestionById = (id: string): Question | undefined => {
  return mockQuestions.find(question => question.id === id);
};

// Function to get all users
export const getUsers = (): User[] => {
  return mockUsers;
};

// Function to add a new user (for mock admin functionality)
export const addUser = (user: User): User => {
  mockUsers.push(user);
  return user;
};

// Function to get a specific user by ID
export const getUserById = (id: string): User | undefined => {
  return mockUsers.find(user => user.id === id);
};

// Function to get a user by email
export const getUserByEmail = (email: string): User | undefined => {
  return mockUsers.find(user => user.email === email);
};

// Function to update a user
export const updateUser = (id: string, userData: Partial<User>): User | undefined => {
  const userIndex = mockUsers.findIndex(user => user.id === id);
  if (userIndex >= 0) {
    mockUsers[userIndex] = { ...mockUsers[userIndex], ...userData };
    return mockUsers[userIndex];
  }
  return undefined;
};

// Function to delete a user
export const deleteUser = (id: string): boolean => {
  const initialLength = mockUsers.length;
  const newUsers = mockUsers.filter(user => user.id !== id);
  if (newUsers.length < initialLength) {
    mockUsers.length = 0;
    mockUsers.push(...newUsers);
    return true;
  }
  return false;
};
