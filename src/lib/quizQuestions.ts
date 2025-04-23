import { supabase } from "@/integrations/supabase/client";
import { Question } from "@/types";

// Fetch all quiz questions from Supabase, ordered by question_number
export async function fetchSupabaseQuestions(): Promise<Question[]> {
  try {
    const { data, error } = await supabase
      .from("quiz_questions")
      .select("*")
      .order("question_number", { ascending: true });

    console.log("Supabase Query Details:");
    console.log("Raw Data Received:", data);
    console.log("Query Error:", error);

    if (error) {
      console.error("Detailed Error Fetching Quiz Questions:", error);
      return [];
    }
    if (!data) {
      console.warn("No questions data returned from Supabase");
      return [];
    }
    
    const processedQuestions = data.map((row) => ({
      id: row.id,
      content: row.content,
      answer: row.answer,
      createdAt: row.created_at,
    }));

    console.log("Processed Questions:", processedQuestions);
    console.log("Total Questions Count:", processedQuestions.length);

    return processedQuestions;
  } catch (catchError) {
    console.error("Unexpected Error in fetchSupabaseQuestions:", catchError);
    return [];
  }
}

// Insert or overwrite all questions (admin function)
export async function importQuestionsToSupabase(questions: { question_number: number; content: string; answer: string }[]) {
  try {
    // Remove all existing questions first (admins only)
    const { error: delError } = await supabase
      .from("quiz_questions")
      .delete()
      .gt("question_number", 0); // Changed from .neq("id", "") to fix the error
    
    if (delError) {
      console.error("Failed to delete old questions:", delError);
      return { error: delError };
    }
    
    // Insert new questions
    const { error: insError } = await supabase
      .from("quiz_questions")
      .insert(questions);
    
    if (insError) {
      console.error("Error inserting questions:", insError);
      return { error: insError };
    }
    
    return { error: null };
  } catch (e) {
    console.error("Exception in importQuestionsToSupabase:", e);
    return { error: e };
  }
}
