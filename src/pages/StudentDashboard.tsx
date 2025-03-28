
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Layout from '@/components/Layout';
import { getQuestions } from '@/services/mockDatabase';
import { Question } from '@/types';
import { Check, Flag } from 'lucide-react';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { ScrollArea } from "@/components/ui/scroll-area";

const StudentDashboard = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [flaggedQuestions, setFlaggedQuestions] = useState<Record<string, boolean>>({});
  const [timeLeft, setTimeLeft] = useState('3:27:00'); // Mock time left

  useEffect(() => {
    const loadQuestions = async () => {
      const fetchedQuestions = getQuestions();
      setQuestions(fetchedQuestions);
      setLoading(false);
    };

    loadQuestions();
  }, []);

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleJumpToQuestion = (index: number) => {
    setCurrentIndex(index);
  };

  const toggleFlag = (questionId: string) => {
    setFlaggedQuestions(prev => ({
      ...prev,
      [questionId]: !prev[questionId]
    }));
  };

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto flex justify-center items-center min-h-[60vh]">
          <p className="text-lg">Loading questions...</p>
        </div>
      </Layout>
    );
  }

  if (questions.length === 0) {
    return (
      <Layout>
        <div className="container mx-auto flex justify-center items-center min-h-[60vh]">
          <Card className="w-full max-w-2xl">
            <CardContent className="p-6">
              <div className="text-center">
                <h2 className="text-xl font-semibold mb-2">No Questions Available</h2>
                <p className="text-muted-foreground">
                  There are no questions available at the moment. Please check back later.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  const currentQuestion = questions[currentIndex];
  const questionNumber = currentIndex + 1;
  const totalQuestions = questions.length;
  const isFlagged = flaggedQuestions[currentQuestion.id] || false;

  // Generate a grid of question numbers for pagination
  const generateQuestionGrid = () => {
    const items = [];
    for (let i = 0; i < totalQuestions; i++) {
      items.push(
        <div key={i} className="w-8 h-8 m-1">
          <button
            onClick={() => handleJumpToQuestion(i)}
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
    <Layout>
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-4">Model Exit Exam for QuizVille 2024</h1>
        
        <div className="flex mb-2 border-b">
          <button className="px-4 py-2 text-muted-foreground">Course</button>
          <button className="px-4 py-2 border-b-2 border-primary font-medium">Quiz</button>
        </div>
        
        <div className="flex flex-col md:flex-row gap-4">
          <div className="w-full md:w-3/4">
            <div className="flex justify-between items-center mb-4">
              <Button variant="outline" onClick={handlePrevious} disabled={currentIndex === 0}>
                Back
              </Button>
              <div className="text-right">
                <div className="inline-block border rounded px-3 py-1 bg-white">
                  Time left: {timeLeft}
                </div>
              </div>
            </div>
            
            {/* Question Status Section - Now with white background */}
            <div className="p-3 bg-white border rounded-md mb-4">
              <span className="font-medium block mb-2">Question {questionNumber}</span>
              <div className="text-sm text-muted-foreground mb-1">
                Not yet answered
              </div>
              <div className="text-sm text-muted-foreground mb-3">
                Marked out of 1.00
              </div>
              <button 
                className={`text-sm flex items-center ${isFlagged ? 'text-amber-600' : 'text-blue-600'}`}
                onClick={() => toggleFlag(currentQuestion.id)}
              >
                <Flag size={16} className="mr-1" />
                {isFlagged ? 'Unflag question' : 'Flag question'}
              </button>
            </div>
            
            {/* Question Content */}
            <div className="bg-blue-50 border rounded-md p-6 mb-4">
              <div className="font-medium mb-3">{currentQuestion.content}</div>
              
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
                      {index === 3 && currentQuestion.answer}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentIndex === 0}
                className="bg-gray-200"
              >
                Previous page
              </Button>
              
              <Button
                onClick={handleNext}
                disabled={currentIndex === questions.length - 1}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Next page
              </Button>
            </div>
          </div>
          
          <div className="w-full md:w-1/4 bg-gray-50 border rounded-md p-4">
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
        </div>
      </div>
    </Layout>
  );
};

export default StudentDashboard;
