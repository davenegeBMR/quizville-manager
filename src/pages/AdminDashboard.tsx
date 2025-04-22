
import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import UserManagement from '@/components/admin/UserManagement';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Info } from 'lucide-react';
import { isSupabaseConfigured } from '@/lib/supabase';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

const LOCAL_STORAGE_KEY = 'importedQuizQuestions';

const AdminDashboard = () => {
  const [usingMock, setUsingMock] = useState(true);
  const [importText, setImportText] = useState('');
  const [importError, setImportError] = useState('');
  const [importSuccess, setImportSuccess] = useState('');

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

  // Function to handle import
  const handleImport = (e: React.FormEvent) => {
    e.preventDefault();
    setImportError('');
    setImportSuccess('');
    // Very simple validation: Must contain at least one question + answer
    if (!importText.trim()) {
      setImportError('Please enter some questions and answers.');
      return;
    }
    try {
      // Let's save as plain text (could be JSON, but plain text is fine for now)
      localStorage.setItem(LOCAL_STORAGE_KEY, importText.trim());
      setImportSuccess('Questions imported successfully!');
    } catch (err) {
      setImportError('Failed to save questions.');
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
              <Button type="submit">Import</Button>
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
            <strong>Note:</strong> Imported questions are stored only in your browser (localStorage). They will override the mock questions in the Quiz Review section.
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
