
import React from 'react';
import { Button } from '@/components/ui/button';
import { Flag } from 'lucide-react';

interface NavigationButtonsProps {
  onPrevious: () => void;
  onNext: () => void;
  isPreviousDisabled: boolean;
  isNextDisabled: boolean;
  questionNumber: number;
  isFlagged: boolean;
  toggleFlag: (questionId: string) => void;
  questionId: string;
}

const NavigationButtons: React.FC<NavigationButtonsProps> = ({
  onPrevious,
  onNext,
  isPreviousDisabled,
  isNextDisabled,
  questionNumber,
  isFlagged,
  toggleFlag,
  questionId,
}) => {
  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-white border rounded-md">
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
      </div>
      
      <div className="flex gap-2">
        <Button
          variant="outline"
          onClick={onPrevious}
          disabled={isPreviousDisabled}
          className="bg-gray-200"
        >
          Previous page
        </Button>
        
        <Button
          onClick={onNext}
          disabled={isNextDisabled}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Next page
        </Button>
      </div>
    </div>
  );
};

export default NavigationButtons;
