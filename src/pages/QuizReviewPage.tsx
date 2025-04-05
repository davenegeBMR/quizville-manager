
import React from 'react';
import Layout from '@/components/Layout';
import QuizReview from '@/components/quiz/QuizReview';

const QuizReviewPage = () => {
  return (
    <Layout>
      <div className="container mx-auto py-6">
        <h1 className="text-2xl font-bold mb-6">Quiz Review Mode</h1>
        <QuizReview />
      </div>
    </Layout>
  );
};

export default QuizReviewPage;
