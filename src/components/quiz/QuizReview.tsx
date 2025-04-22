
import React from 'react';
import { Question } from '@/types';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { getQuestions } from '@/services/mockDatabase';
import { useIsMobile } from '@/hooks/use-mobile';

// Key must match AdminDashboard
const LOCAL_STORAGE_KEY = 'importedQuizQuestions';

// Parse imported text into question objects
function parseImportedQuestions(importText: string): Question[] {
  // Simple parser expecting format:
  // 1. Question text
  // Answer: answer text
  // Empty line between questions
  const blocks = importText.split(/\n\s*\n/);
  let questions: Question[] = [];
  let idSeed = 0;

  blocks.forEach((block, idx) => {
    const lines = block.split('\n');
    const contentLine = lines.find(l => l.match(/^\d+\.\s+/));
    const answerLine = lines.find(l => l.toLowerCase().startsWith('answer:'));

    if (contentLine && answerLine) {
      questions.push({
        id: `imported-${idSeed + idx}`,
        content: contentLine.replace(/^\d+\.\s*/, '').trim(),
        answer: answerLine.replace(/^Answer:\s*/i, '').trim(),
        createdAt: '',
        options: undefined,
        points: undefined,
        flagged: false,
      });
    }
  });

  return questions;
}

const QuizReview = () => {
  // Try to load imported questions from localStorage
  let importedQuestions: Question[] | null = null;
  let hasImported = false;
  if (typeof window !== 'undefined') {
    const importText = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (importText && importText.trim()) {
      importedQuestions = parseImportedQuestions(importText);
      hasImported = importedQuestions.length > 0;
    }
  }

  // Use imported OR mock
  const questions: Question[] = hasImported
    ? importedQuestions!
    : getQuestions();

  const isMobile = useIsMobile();

  // Generate the formatted quiz text
  const generateQuizText = () => {
    return questions.map((question, index) => {
      const questionText = `${index + 1}. ${question.content}\n`;
      // Mock options (since our data model doesn't have structured options)
      const options = [
        'a. They are used for the measurement of force and to control motion',
        'b. They are used to store energy',
        'c. They are used to absorb shocks and vibrations',
        'd. ' + question.answer
      ];
      // Join options with newlines
      const optionsText = options.join('\n');
      const answerText = 'Answer: d';
      // Combine everything with proper spacing
      return `${questionText}${optionsText}\n${answerText}\n\n`;
    }).join('');
  };

  const formattedQuizText = generateQuizText();

  return (
    <Card className="w-full mx-auto">
      <CardHeader className="sticky top-0 bg-card z-10 border-b">
        <CardTitle>Quiz Review</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className={`${isMobile ? 'h-[60vh]' : 'h-[70vh]'} rounded-md`}>
          <div className="p-4">
            <pre className="whitespace-pre-wrap font-sans text-base">
              {formattedQuizText}
            </pre>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default QuizReview;
