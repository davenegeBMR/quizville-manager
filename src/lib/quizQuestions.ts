
import { Question } from "@/types";

// Mock quiz questions data
const mockQuestions: Question[] = [
  {
    id: "q1",
    content: "What is the purpose of springs in mechanical engineering?",
    answer: "Springs are used to store energy and provide force in mechanical systems",
    createdAt: new Date().toISOString()
  },
  {
    id: "q2",
    content: "Which principle explains why airplanes can fly?",
    answer: "Bernoulli's principle - the relationship between fluid pressure and velocity",
    createdAt: new Date().toISOString()
  },
  {
    id: "q3",
    content: "What is the main function of a capacitor in an electronic circuit?",
    answer: "To store and release electrical charge",
    createdAt: new Date().toISOString()
  }
];

// Return mock questions instead of fetching from Supabase
export async function fetchSupabaseQuestions(): Promise<Question[]> {
  return mockQuestions;
}

// Mock function for importing questions (admin function)
export async function importQuestionsToSupabase(questions: { question_number: number; content: string; answer: string }[]) {
  console.log("Mock import function called with:", questions);
  return { error: null };
}
