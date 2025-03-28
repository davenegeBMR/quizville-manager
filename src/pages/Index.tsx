
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/Layout';

const Index = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin } = useAuth();

  const handleGetStarted = () => {
    if (isAuthenticated) {
      // Redirect based on role
      if (isAdmin) {
        navigate('/admin');
      } else {
        navigate('/student');
      }
    } else {
      navigate('/login');
    }
  };

  return (
    <Layout>
      <div className="min-h-[80vh] flex flex-col items-center justify-center">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h1 className="text-5xl font-bold mb-4 text-primary">Welcome to QuizVille</h1>
          <p className="text-xl text-muted-foreground">
            A platform for administrators to manage questions and answers, 
            and for students to navigate through content easily.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl w-full">
          <Card className="shadow-md hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-secondary">For Administrators</CardTitle>
              <CardDescription>Manage questions and student accounts</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>Create and manage questions and answers</li>
                <li>Import multiple questions at once</li>
                <li>Create and manage student accounts</li>
                <li>Control who has access to your content</li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full bg-secondary hover:bg-secondary/90" 
                onClick={() => navigate('/login')}
              >
                Admin Login
              </Button>
            </CardFooter>
          </Card>

          <Card className="shadow-md hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-primary">For Students</CardTitle>
              <CardDescription>Access your assigned questions</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>Simple navigation through questions</li>
                <li>Easy-to-read question and answer format</li>
                <li>Track your progress through the content</li>
                <li>Access from any device</li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full" 
                onClick={() => navigate('/login')}
              >
                Student Login
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div className="mt-12">
          <Button size="lg" onClick={handleGetStarted}>
            {isAuthenticated ? 'Go to Dashboard' : 'Get Started'}
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
