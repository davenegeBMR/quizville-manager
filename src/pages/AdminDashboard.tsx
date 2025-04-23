import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import UserManagement from '@/components/admin/UserManagement';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Info } from 'lucide-react';
import { isSupabaseConfigured } from '@/lib/supabase';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { importQuestionsToSupabase } from "@/lib/quizQuestions";

const LOCAL_STORAGE_KEY = 'importedQuizQuestions';

const AdminDashboard = () => {
  const [usingMock, setUsingMock] = useState(true);
  const [importText, setImportText] = useState('');
  const [importError, setImportError] = useState('');
  const [importSuccess, setImportSuccess] = useState('');
  const [isImporting, setIsImporting] = useState(false);

  useEffect(() => {
    const checkSupabase = async () => {
      const isConfigured = isSupabaseConfigured();
      setUsingMock(!isConfigured);
    };
    checkSupabase();

    // Load existing import if any
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (stored) {
      setImportText(stored);
    }
  }, []);

  // Parse text into question objects (move logic here for reuse)
  function parseImportedQuestionsForDB(importText: string): { question_number: number; content: string; answer: string }[] {
    // 1. Question text
    // Answer: answer text
    // Empty line between questions
    const blocks = importText.split(/\n\s*\n/);
    let questions: { question_number: number; content: string; answer: string }[] = [];
    blocks.forEach((block, idx) => {
      const lines = block.split('\n');
      const contentLine = lines.find(l => l.match(/^\d+\.\s+/));
      const answerLine = lines.find(l => l.toLowerCase().startsWith('answer:'));
      if (contentLine && answerLine) {
        questions.push({
          question_number: idx + 1,
          content: contentLine.replace(/^\d+\.\s*/, '').trim(),
          answer: answerLine.replace(/^Answer:\s*/i, '').trim(),
        });
      }
    });
    return questions;
  }

  // Function to handle import
  const handleImport = async (e: React.FormEvent) => {
    e.preventDefault();
    setImportError('');
    setImportSuccess('');
    setIsImporting(true);

    if (!importText.trim()) {
      setImportError('Please enter some questions and answers.');
      setIsImporting(false);
      return;
    }

    try {
      // Save to localStorage as a backup
      localStorage.setItem(LOCAL_STORAGE_KEY, importText.trim());

      // Send to Supabase (overwrites all)
      const questions = parseImportedQuestionsForDB(importText);
      const { error } = await importQuestionsToSupabase(questions);

      if (error) {
        setImportError("Failed to import to Supabase. " + (error.message || error.toString()));
      } else {
        setImportSuccess('Questions imported to Supabase successfully!');
      }
    } catch (err: any) {
      setImportError('Failed to save questions. ' + (err.message || err.toString()));
    } finally {
      setIsImporting(false);
    }
  };

  const handleClear = () => {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    setImportText('');
    setImportSuccess('Imported questions cleared.');
  };

  return (
    <Layout>
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
        {/* Import Section */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-2">Import Quiz Questions</h2>
          <form onSubmit={handleImport}>
            <Textarea
              className="mb-2"
              placeholder={
                "Paste questions/answers below. Example format:\n\n1. What is a spring?\nAnswer: A mechanical device that stores energy.\n"
              }
              value={importText}
              onChange={e => setImportText(e.target.value)}
              rows={8}
            />
            <div className="flex gap-2 mt-2">
              <Button type="submit" disabled={isImporting}>{isImporting ? "Importing..." : "Import"}</Button>
              <Button type="button" variant="outline" onClick={handleClear}>Clear Imported</Button>
            </div>
            {importError && (
              <div className="text-red-500 text-sm mt-2">{importError}</div>
            )}
            {importSuccess && (
              <div className="text-green-600 text-sm mt-2">{importSuccess}</div>
            )}
          </form>
          <div className="text-muted-foreground text-xs mt-3">
            <strong>Note:</strong> Imported questions are now stored in Supabase (and also in your browser as a backup). They will override the mock questions in all quiz sections.
          </div>
        </div>

        {usingMock && (
          <Alert variant="warning" className="mb-6">
            <Info className="h-4 w-4" />
            <AlertTitle>Using Mock Database</AlertTitle>
            <AlertDescription>
              <p>Supabase is not configured. Using mock database instead.</p>
              <p className="text-sm mt-2">All user management operations will be performed on local memory only and will not persist after page refresh.</p>
            </AlertDescription>
          </Alert>
        )}
        
        <div className="space-y-8">
          <UserManagement />
          
          {/* Other admin components can be added here */}
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
