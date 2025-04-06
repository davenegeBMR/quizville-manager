
import React from 'react';
import { Question } from '@/types';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { getQuestions } from '@/services/mockDatabase';
import { useIsMobile } from '@/hooks/use-mobile';

const QuizReview = () => {
  const questions = getQuestions();
  const isMobile = useIsMobile();
  
  // Generate the formatted quiz text
  const generateQuizText = () => {
    return questions.map((question, index) => {
      // For each question, create the formatted text
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
      
      // The answer is always d in our mock data
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
