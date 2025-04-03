
import React from 'react';
import { Question } from '@/types';

interface QuestionContentProps {
  question: Question;
}

const QuestionContent: React.FC<QuestionContentProps> = ({ question }) => {
  return (
    <div className="bg-blue-50 border rounded-md p-6 h-full">
      <div className="font-medium mb-3">{question.content}</div>
      
      <div className="space-y-3">
        {['a', 'b', 'c', 'd'].map((option, index) => (
          <div key={index} className="flex items-start">
            <input 
              type="radio" 
              id={`option-${option}`} 
              name="question-option" 
              className="mt-1 mr-2"
            />
            <label htmlFor={`option-${option}`} className="cursor-pointer">
              <span className="mr-2">{option}.</span>
              {index === 0 && "They are used for the measurement of force and to control motion"}
              {index === 1 && "They are used to store energy"}
              {index === 2 && "They are used to absorb shocks and vibrations"}
              {index === 3 && question.answer}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuestionContent;
