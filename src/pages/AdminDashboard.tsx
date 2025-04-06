import React from 'react';
import Layout from '@/components/Layout';
import UserManagement from '@/components/admin/UserManagement';

const AdminDashboard = () => {
  return (
    <Layout>
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
        
        <div className="space-y-8">
          <UserManagement />
          
          {/* Other admin components can be added here */}
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
