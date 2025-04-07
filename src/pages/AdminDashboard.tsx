
import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import UserManagement from '@/components/admin/UserManagement';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Info } from 'lucide-react';
import { isSupabaseConfigured } from '@/lib/supabase';

const AdminDashboard = () => {
  const [usingMock, setUsingMock] = useState(true);
  
  useEffect(() => {
    const checkSupabase = async () => {
      const isConfigured = isSupabaseConfigured();
      setUsingMock(!isConfigured);
    };
    
    checkSupabase();
  }, []);
  
  return (
    <Layout>
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
        
        {usingMock && (
          <Alert variant="warning" className="mb-6">
            <Info className="h-4 w-4" />
            <AlertTitle>Using Mock Database</AlertTitle>
            <AlertDescription>
              <p>Supabase is not configured. Using mock database instead.</p>
              <p className="text-sm mt-2">All user management operations will be performed on local memory only and will not persist after page refresh.</p>
            </AlertDescription>
          </Alert>
        )}
        
        <div className="space-y-8">
          <UserManagement />
          
          {/* Other admin components can be added here */}
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
