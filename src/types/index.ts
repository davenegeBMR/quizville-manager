
export type UserRole = 'admin' | 'student';

export interface User {
  id: string;
  username: string;
  password: string;
  role: UserRole;
}

export interface Question {
  id: string;
  content: string;
  answer: string;
  createdAt: string;
}
