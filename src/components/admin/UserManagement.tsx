
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, UserPlus } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { isSupabaseConfigured, adminCreateUser } from '@/lib/supabase';
import { mockUsers } from '@/services/mockDatabase';
import { User, UserRole, CreateUserFormData } from '@/types';
import UserTable from './UserTable';
import UserDialog from './UserDialog';

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogState, setDialogState] = useState<{
    type: 'create' | 'edit' | 'delete' | null;
    user: User | null;
  }>({ type: null, user: null });

  const [formData, setFormData] = useState<CreateUserFormData>({
    email: '', password: '', username: '', role: 'student'
  });

  const { toast } = useToast();

  useEffect(() => { fetchUsers(); }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      if (!isSupabaseConfigured()) {
        setUsers(mockUsers.map(({ id, username, email, role }) => ({ id, username, email, role })));
        setLoading(false);
        return;
      }
      const { data, error } = await (supabase as any).from('profiles').select('*');
      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to fetch users.', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleUserSubmit = async (type: 'create' | 'edit', data: CreateUserFormData, userId?: string) => {
    try {
      setLoading(true);
      if (!isSupabaseConfigured()) {
        if (type === 'create') {
          const newUser: User = { id: `mock-${Date.now()}`, ...data };
          mockUsers.push(newUser);
          setFormData({ email: '', password: '', username: '', role: 'student' });
        } else if (type === 'edit' && userId) {
          const idx = mockUsers.findIndex(u => u.id === userId);
          if (idx >= 0) Object.assign(mockUsers[idx], data);
        }
        await fetchUsers();
        toast({ title: 'Success', description: `Mock user ${type === 'create' ? 'created' : 'updated'} successfully.` });
        setDialogState({ type: null, user: null });
        setLoading(false);
        return;
      }
      if (type === 'create') {
        const { error } = await adminCreateUser(data.email, data.password, { username: data.username, role: data.role });
        if (error) throw error;
      } else if (type === 'edit' && userId) {
        const { error } = await (supabase as any).from('profiles').update({ username: data.username, role: data.role }).eq('id', userId);
        if (error) throw error;
      }
      setFormData({ email: '', password: '', username: '', role: 'student' });
      await fetchUsers();
      toast({ title: 'Success', description: `User ${type === 'create' ? 'created' : 'updated'} successfully.` });
      setDialogState({ type: null, user: null });
    } catch (error: any) {
      toast({ title: 'Error', description: error?.message || `Failed to ${type} user.`, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      setLoading(true);
      if (!isSupabaseConfigured()) {
        const newUsers = mockUsers.filter(u => u.id !== userId);
        mockUsers.length = 0; mockUsers.push(...newUsers);
        await fetchUsers();
        toast({ title: 'Success', description: 'User deleted successfully.' });
        setDialogState({ type: null, user: null });
        setLoading(false);
        return;
      }
      const { error } = await (supabase as any).auth.admin.deleteUser(userId);
      if (error) throw error;
      await fetchUsers();
      toast({ title: 'Success', description: 'User deleted successfully.' });
      setDialogState({ type: null, user: null });
    } catch (error: any) {
      toast({ title: 'Error', description: error?.message || 'Failed to delete user.', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>User Management</CardTitle>
          <CardDescription>Manage system users</CardDescription>
        </div>
        <Button onClick={() => setDialogState({ type: 'create', user: null })}>
          <UserPlus className="mr-2 h-4 w-4" /> Add User
        </Button>
      </CardHeader>
      <CardContent>
        {loading && users.length === 0 ? (
          <div className="flex justify-center py-10">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <UserTable 
            users={users}
            onEdit={user => setDialogState({ type: 'edit', user })}
            onDelete={user => setDialogState({ type: 'delete', user })}
          />
        )}
        <UserDialog
          state={dialogState}
          setState={setDialogState}
          loading={loading}
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleUserSubmit}
          onDelete={handleDeleteUser}
        />
      </CardContent>
    </Card>
  );
};

export default UserManagement;
