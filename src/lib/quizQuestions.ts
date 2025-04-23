
import { supabase } from "@/integrations/supabase/client";
import { Question } from "@/types";

// Fetch all quiz questions from Supabase, ordered by question_number
export async function fetchSupabaseQuestions(): Promise<Question[]> {
  const { data, error } = await supabase
    .from("quiz_questions")
    .select("*")
    .order("question_number", { ascending: true });

  if (error) {
    console.error("Error fetching quiz questions:", error);
    return [];
  }
  if (!data) return [];
  return data.map((row) => ({
    id: row.id,
    content: row.content,
    answer: row.answer,
    createdAt: row.created_at,
    // No options, points, flagged in db schema
  }));
}

// Insert or overwrite all questions (admin function)
export async function importQuestionsToSupabase(questions: { question_number: number; content: string; answer: string }[]) {
  // Remove all existing questions first (admins only)
  const { error: delError } = await supabase.from("quiz_questions").delete().neq("id", "");
  if (delError) {
    console.error("Failed to delete old questions:", delError);
    return { error: delError };
  }
  // Insert new questions
  const { error: insError } = await supabase.from("quiz_questions").insert(questions);
  if (insError) {
    console.error("Error inserting questions:", insError);
    return { error: insError };
  }
  return { error: null };
}
