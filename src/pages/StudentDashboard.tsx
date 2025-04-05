
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Layout from '@/components/Layout';
import { getQuestions } from '@/services/mockDatabase';
import { Question } from '@/types';
import QuestionContent from '@/components/quiz/QuestionContent';
import NavigationButtons from '@/components/quiz/NavigationButtons';
import QuizNavigation from '@/components/quiz/QuizNavigation';
import { Flag } from 'lucide-react';

const StudentDashboard = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [flaggedQuestions, setFlaggedQuestions] = useState<Record<string, boolean>>({});
  const [timeLeft, setTimeLeft] = useState('3:27:00'); // Mock time left

  useEffect(() => {
    const loadQuestions = async () => {
      // Get initial questions
      const fetchedQuestions = getQuestions();
      
      // Generate additional questions to reach approximately 100
      const additionalQuestions: Question[] = [];
      const targetCount = 100;
      
      for (let i = fetchedQuestions.length; i < targetCount; i++) {
        additionalQuestions.push({
          id: `q${i+1}`,
          content: `Sample Question ${i+1}: What is the correct answer to this multiple-choice question?`,
          answer: `This is the answer to question ${i+1}.`,
          createdAt: new Date().toISOString()
        });
      }
      
      // Combine original and additional questions
      setQuestions([...fetchedQuestions, ...additionalQuestions]);
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
            
            <div className="flex items-start gap-4 mb-4">
              {/* Question Status Information - now positioned at the top-left */}
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
                  onClick={() => toggleFlag(currentQuestion.id)}
                >
                  <Flag size={16} className="mr-1" />
                  {isFlagged ? 'Unflag question' : 'Flag question'}
                </button>
              </div>
              
              {/* Question Content */}
              <div className="flex-1">
                <QuestionContent question={currentQuestion} />
              </div>
            </div>
            
            <NavigationButtons 
              onPrevious={handlePrevious}
              onNext={handleNext}
              isPreviousDisabled={currentIndex === 0}
              isNextDisabled={currentIndex === questions.length - 1}
              questionNumber={questionNumber}
              isFlagged={isFlagged}
              toggleFlag={toggleFlag}
              questionId={currentQuestion.id}
            />
          </div>
          
          <div className="w-full md:w-1/4">
            <QuizNavigation 
              questions={questions}
              currentIndex={currentIndex}
              flaggedQuestions={flaggedQuestions}
              onJumpToQuestion={handleJumpToQuestion}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default StudentDashboard;
