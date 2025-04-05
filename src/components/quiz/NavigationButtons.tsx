
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
    <div className="flex justify-between items-center mt-4 w-full">
      <Button
        variant="outline"
        onClick={onPrevious}
        disabled={isPreviousDisabled}
        className="bg-gray-200"
      >
        Previous page
      </Button>
      
      <Button
        onClick={() => toggleFlag(questionId)}
        variant="outline"
        className={`${isFlagged ? 'text-amber-600' : 'text-blue-600'}`}
      >
        <Flag size={16} className="mr-1" />
        {isFlagged ? 'Unflag question' : 'Flag question'}
      </Button>
      
      <Button
        onClick={onNext}
        disabled={isNextDisabled}
        className="bg-blue-600 hover:bg-blue-700"
      >
        Next page
      </Button>
    </div>
  );
};

export default NavigationButtons;
