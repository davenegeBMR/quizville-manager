
import React from 'react';
import { Button } from '@/components/ui/button';

interface NavigationButtonsProps {
  onPrevious: () => void;
  onNext: () => void;
  isPreviousDisabled: boolean;
  isNextDisabled: boolean;
}

const NavigationButtons: React.FC<NavigationButtonsProps> = ({
  onPrevious,
  onNext,
  isPreviousDisabled,
  isNextDisabled,
}) => {
  return (
    <div className="flex justify-between">
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
  );
};

export default NavigationButtons;
