
import React from 'react';
import Layout from '@/components/Layout';
import QuizReview from '@/components/quiz/QuizReview';
import { useNavigate } from 'react-router-dom';

const QuizReviewPage = () => {
  const navigate = useNavigate();
  
  const navigateToSection = (section: string) => {
    if (section === 'quiz') {
      navigate('/student');
    } else if (section === 'course') {
      // This would ideally navigate to a courses page, but for now we'll just log
      console.log('Navigate to courses section - not implemented yet');
      // When you have a courses page, you can use: navigate('/courses');
    }
    // The current page is already the quiz review section, so no navigation needed for that
  };

  return (
    <Layout>
      <div className="container mx-auto p-4">
        <div className="sticky top-0 z-10 bg-background pb-2">
          <h1 className="text-3xl font-bold mb-4">Model Exit Exam for QuizVille 2024</h1>
          
          <div className="flex mb-6 border-b">
            <button 
              className="px-4 py-2 text-muted-foreground hover:text-primary hover:bg-accent/50"
              onClick={() => navigateToSection('course')}
            >
              Course
            </button>
            <button 
              className="px-4 py-2 text-muted-foreground hover:text-primary hover:bg-accent/50"
              onClick={() => navigateToSection('quiz')}
            >
              Quiz
            </button>
            <button 
              className="px-4 py-2 border-b-2 border-primary font-medium"
            >
              Quiz Review
            </button>
          </div>
        </div>
        
        <QuizReview />
      </div>
    </Layout>
  );
};

export default QuizReviewPage;
