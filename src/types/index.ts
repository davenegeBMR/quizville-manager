
export type UserRole = 'admin' | 'student';

export interface User {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  password?: string; // Only used for mock data, not used with Supabase
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

export interface Profile {
  id: string;
  username: string;
  role: UserRole;
  created_at?: string;
  email?: string;
}

export interface CreateUserFormData {
  email: string;
  password: string;
  username: string;
  role: UserRole;
}
