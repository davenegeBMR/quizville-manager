
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { currentUser, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-primary text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">QuizVille</h1>
          
          {currentUser && (
            <div className="flex items-center gap-4">
              <span>
                Welcome, {currentUser.username} 
                <span className="ml-2 text-sm bg-white text-primary px-2 py-0.5 rounded-full">
                  {currentUser.role}
                </span>
              </span>
              
              <Button 
                variant="outline" 
                className="border-white text-white hover:bg-white hover:text-primary"
                onClick={() => logout()}
              >
                Logout
              </Button>
            </div>
          )}
        </div>
      </header>
      
      <main className="flex-grow container mx-auto p-4">
        {children}
      </main>
      
      <footer className="bg-muted p-4 text-center text-muted-foreground">
        <p>© {new Date().getFullYear()} QuizVille - All rights reserved</p>
      </footer>
    </div>
  );
};

export default Layout;
