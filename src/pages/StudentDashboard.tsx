import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Layout from '@/components/Layout';
import { getQuestions } from '@/services/mockDatabase';
import { Question } from '@/types';
import QuestionContent from '@/components/quiz/QuestionContent';
import NavigationButtons from '@/components/quiz/NavigationButtons';
import QuizNavigation from '@/components/quiz/QuizNavigation';
import QuestionStatus from '@/components/quiz/QuestionStatus';
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';

const StudentDashboard = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [flaggedQuestions, setFlaggedQuestions] = useState<Record<string, boolean>>({});
  const [timeLeft, setTimeLeft] = useState('3:27:00'); // Mock time left
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const loadQuestions = async () => {
      try {
        const mockQuestions = getQuestions();
        const additionalQuestions: Question[] = [];
        const targetCount = 100;
        
        for (let i = mockQuestions.length; i < targetCount; i++) {
          additionalQuestions.push({
            id: `q${i+1}`,
            content: `Sample Question ${i+1}: What is the correct answer to this multiple-choice question?`,
            answer: `This is the answer to question ${i+1}.`,
            createdAt: new Date().toISOString()
          });
        }
        
        const allQuestions = [...mockQuestions, ...additionalQuestions];
        setQuestions(allQuestions);
        toast({
          title: "Questions Loaded",
          description: `Loaded ${allQuestions.length} questions`,
        });
      } catch (error) {
        console.error("Error loading questions:", error);
        toast({
          title: "Error Loading Questions",
          description: "There was an error loading questions. Using mock data instead.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadQuestions();
  }, [toast]);

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
    console.log(`Toggling flag for question ID: ${questionId}`);
    console.log(`Current flagged status: ${flaggedQuestions[questionId] ? 'Flagged' : 'Not flagged'}`);
    
    setFlaggedQuestions(prev => {
      const newState = {
        ...prev,
        [questionId]: !prev[questionId]
      };
      console.log('New flagged state:', newState);
      return newState;
    });
  };

  const navigateToSection = (section: string) => {
    if (section === 'quiz-review') {
      navigate('/quiz-review');
    } else if (section === 'course') {
      console.log('Navigate to courses section - not implemented yet');
    }
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
          <button 
            className="px-4 py-2 text-muted-foreground hover:text-primary hover:bg-accent/50"
            onClick={() => navigateToSection('course')}
          >
            Course
          </button>
          <button 
            className="px-4 py-2 border-b-2 border-primary font-medium"
          >
            Quiz
          </button>
          <button 
            className="px-4 py-2 text-muted-foreground hover:text-primary hover:bg-accent/50"
            onClick={() => navigateToSection('quiz-review')}
          >
            Quiz Review
          </button>
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
              <QuestionStatus 
                questionNumber={questionNumber} 
                isFlagged={isFlagged} 
                toggleFlag={toggleFlag}
                questionId={currentQuestion.id}
              />
              
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
