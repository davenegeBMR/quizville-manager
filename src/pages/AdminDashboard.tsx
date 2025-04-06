
import React from 'react';
import Layout from '@/components/Layout';
import UserManagement from '@/components/admin/UserManagement';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { isSupabaseConfigured } from '@/lib/supabase';
import { AlertCircle } from 'lucide-react';

const AdminDashboard = () => {
  const supabaseIsConfigured = isSupabaseConfigured();

  return (
    <Layout>
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
        
        {!supabaseIsConfigured && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Supabase Configuration Error</AlertTitle>
            <AlertDescription>
              Supabase URL and/or Anon Key are not properly configured. Please check your Supabase connection.
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
