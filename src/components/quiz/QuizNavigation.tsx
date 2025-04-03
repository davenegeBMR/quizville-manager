
import React from 'react';
import { Check } from 'lucide-react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Question } from '@/types';

interface QuizNavigationProps {
  questions: Question[];
  currentIndex: number;
  flaggedQuestions: Record<string, boolean>;
  onJumpToQuestion: (index: number) => void;
}

const QuizNavigation: React.FC<QuizNavigationProps> = ({
  questions,
  currentIndex,
  flaggedQuestions,
  onJumpToQuestion,
}) => {
  const generateQuestionGrid = () => {
    const items = [];
    for (let i = 0; i < questions.length; i++) {
      items.push(
        <div key={i} className="w-8 h-8 m-1">
          <button
            onClick={() => onJumpToQuestion(i)}
            className={`w-full h-full rounded-md flex flex-col overflow-hidden ${currentIndex === i ? 'border-2 border-primary' : 'border border-gray-300'} ${flaggedQuestions[questions[i].id] ? 'bg-amber-100' : ''}`}
          >
            <div className="bg-gray-600 h-1/2 w-full flex items-center justify-center">
              <span className="text-white text-xs"></span>
            </div>
            <div className="bg-white h-1/2 w-full flex items-center justify-center">
              <span className="text-xs font-medium">{i + 1}</span>
            </div>
          </button>
        </div>
      );
    }
    return items;
  };

  return (
    <div className="w-full bg-gray-50 border rounded-md p-4">
      <h2 className="font-semibold mb-4">Quiz navigation</h2>
      
      <ScrollArea className="h-[400px] rounded-md">
        <div className="grid grid-cols-5 gap-1">
          {generateQuestionGrid()}
        </div>
      </ScrollArea>
      
      <div className="mt-4 border-t pt-4">
        <div className="flex items-center mb-2">
          <div className="w-6 h-6 rounded border overflow-hidden">
            <div className="bg-gray-600 h-1/2 w-full"></div>
            <div className="bg-white h-1/2 w-full"></div>
          </div>
          <span className="text-sm ml-2">Not yet answered</span>
        </div>
        <div className="flex items-center mb-2">
          <div className="w-6 h-6 rounded border overflow-hidden">
            <div className="bg-gray-600 h-1/2 w-full"></div>
            <div className="bg-primary h-1/2 w-full flex items-center justify-center">
              <Check size={12} className="text-white" />
            </div>
          </div>
          <span className="text-sm ml-2">Answered</span>
        </div>
        <div className="flex items-center">
          <div className="w-6 h-6 rounded border overflow-hidden bg-amber-100">
            <div className="bg-gray-600 h-1/2 w-full"></div>
            <div className="bg-amber-100 h-1/2 w-full"></div>
          </div>
          <span className="text-sm ml-2">Flagged</span>
        </div>
      </div>
    </div>
  );
};

export default QuizNavigation;
