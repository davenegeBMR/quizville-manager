
import { User, Question } from '@/types';

// Mock admin user
const adminUser: User = {
  id: 'admin-1',
  username: 'admin',
  password: 'admin123', // In a real app, this would be hashed
  role: 'admin'
};

// Mock student users
const initialStudents: User[] = [
  {
    id: 'student-1',
    username: 'student1',
    password: 'student123', // In a real app, this would be hashed
    role: 'student'
  },
  {
    id: 'student-2',
    username: 'student2',
    password: 'student123', // In a real app, this would be hashed
    role: 'student'
  }
];

// Mock questions
const initialQuestions: Question[] = [
  {
    id: 'q1',
    content: 'What is the capital of France?',
    answer: 'Paris is the capital of France.',
    createdAt: new Date().toISOString()
  },
  {
    id: 'q2',
    content: 'What is the largest planet in our solar system?',
    answer: 'Jupiter is the largest planet in our solar system.',
    createdAt: new Date().toISOString()
  },
  {
    id: 'q3',
    content: 'Who wrote "Romeo and Juliet"?',
    answer: 'William Shakespeare wrote "Romeo and Juliet".',
    createdAt: new Date().toISOString()
  }
];

// Store our data in localStorage
const initializeData = () => {
  if (!localStorage.getItem('users')) {
    localStorage.setItem('users', JSON.stringify([adminUser, ...initialStudents]));
  }
  if (!localStorage.getItem('questions')) {
    localStorage.setItem('questions', JSON.stringify(initialQuestions));
  }
};

// Initialize data when the app starts
initializeData();

// User-related functions
export const getUsers = (): User[] => {
  const usersJSON = localStorage.getItem('users');
  return usersJSON ? JSON.parse(usersJSON) : [];
};

export const getUserByUsername = (username: string): User | undefined => {
  const users = getUsers();
  return users.find(user => user.username === username);
};

export const addUser = (user: Omit<User, 'id'>): User => {
  const users = getUsers();
  const newUser = { ...user, id: `user-${Date.now()}` };
  localStorage.setItem('users', JSON.stringify([...users, newUser]));
  return newUser;
};

export const updateUser = (userId: string, updates: Partial<Omit<User, 'id'>>): User | null => {
  const users = getUsers();
  const userIndex = users.findIndex(u => u.id === userId);
  
  if (userIndex === -1) return null;
  
  const updatedUsers = [...users];
  updatedUsers[userIndex] = { ...updatedUsers[userIndex], ...updates };
  
  localStorage.setItem('users', JSON.stringify(updatedUsers));
  return updatedUsers[userIndex];
};

export const deleteUser = (userId: string): boolean => {
  const users = getUsers();
  const filteredUsers = users.filter(u => u.id !== userId);
  
  if (filteredUsers.length === users.length) return false;
  
  localStorage.setItem('users', JSON.stringify(filteredUsers));
  return true;
};

// Question-related functions
export const getQuestions = (): Question[] => {
  const questionsJSON = localStorage.getItem('questions');
  return questionsJSON ? JSON.parse(questionsJSON) : [];
};

export const getQuestionById = (questionId: string): Question | undefined => {
  const questions = getQuestions();
  return questions.find(q => q.id === questionId);
};

export const addQuestion = (question: Omit<Question, 'id' | 'createdAt'>): Question => {
  const questions = getQuestions();
  const newQuestion = { 
    ...question, 
    id: `q-${Date.now()}`, 
    createdAt: new Date().toISOString() 
  };
  
  localStorage.setItem('questions', JSON.stringify([...questions, newQuestion]));
  return newQuestion;
};

export const updateQuestion = (questionId: string, updates: Partial<Omit<Question, 'id' | 'createdAt'>>): Question | null => {
  const questions = getQuestions();
  const questionIndex = questions.findIndex(q => q.id === questionId);
  
  if (questionIndex === -1) return null;
  
  const updatedQuestions = [...questions];
  updatedQuestions[questionIndex] = { 
    ...updatedQuestions[questionIndex], 
    ...updates 
  };
  
  localStorage.setItem('questions', JSON.stringify(updatedQuestions));
  return updatedQuestions[questionIndex];
};

export const deleteQuestion = (questionId: string): boolean => {
  const questions = getQuestions();
  const filteredQuestions = questions.filter(q => q.id !== questionId);
  
  if (filteredQuestions.length === questions.length) return false;
  
  localStorage.setItem('questions', JSON.stringify(filteredQuestions));
  return true;
};

// Import questions from CSV or text content
export const importQuestions = (questionsData: Array<{content: string, answer: string}>): Question[] => {
  const questions = getQuestions();
  const newQuestions = questionsData.map(q => ({
    ...q,
    id: `q-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    createdAt: new Date().toISOString()
  }));
  
  localStorage.setItem('questions', JSON.stringify([...questions, ...newQuestions]));
  return newQuestions;
};
