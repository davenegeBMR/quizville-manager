
export type UserRole = 'admin' | 'student';

export interface User {
  id: string;
  username: string;
  password: string;
  role: UserRole;
}

export interface QuestionOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface Question {
  id: string;
  content: string;
  answer: string;
  createdAt: string;
  options?: QuestionOption[];
  points?: number;
  flagged?: boolean;
}
