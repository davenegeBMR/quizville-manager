
import React from 'react';
import { Flag } from 'lucide-react';

interface QuestionStatusProps {
  questionNumber: number;
  isFlagged: boolean;
  toggleFlag: (questionId: string) => void;
  questionId: string;
}

const QuestionStatus: React.FC<QuestionStatusProps> = ({
  questionNumber,
  isFlagged,
  toggleFlag,
  questionId,
}) => {
  return (
    <div className="p-3 bg-white border rounded-md h-full">
      <span className="font-medium block mb-2">Question {questionNumber}</span>
      <div className="text-sm text-muted-foreground mb-1">
        Not yet answered
      </div>
      <div className="text-sm text-muted-foreground mb-3">
        Marked out of 1.00
      </div>
      <button 
        className={`text-sm flex items-center ${isFlagged ? 'text-amber-600' : 'text-blue-600'}`}
        onClick={() => toggleFlag(questionId)}
      >
        <Flag size={16} className="mr-1" />
        {isFlagged ? 'Unflag question' : 'Flag question'}
      </button>
    </div>
  );
};

export default QuestionStatus;
