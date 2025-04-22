
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { User, UserRole, CreateUserFormData } from '@/types';

type StateType = { type: 'create' | 'edit' | 'delete' | null, user: User | null };
type SetState = React.Dispatch<React.SetStateAction<StateType>>;
type SetFormData = React.Dispatch<React.SetStateAction<CreateUserFormData>>;

interface Props {
  state: StateType;
  setState: SetState;
  loading: boolean;
  formData: CreateUserFormData;
  setFormData: SetFormData;
  onSubmit: (type: 'create' | 'edit', data: CreateUserFormData, userId?: string) => void;
  onDelete: (userId: string) => void;
}

const UserDialog: React.FC<Props> = ({
  state, setState, loading, formData, setFormData, onSubmit, onDelete
}) => {
  const open = state.type !== null;

  React.useEffect(() => {
    if (state.type === 'edit' && state.user) {
      setFormData({
        email: state.user.email || '',
        password: '',
        username: state.user.username,
        role: state.user.role
      });
    }
    if (state.type === 'create') {
      setFormData({ email: '', password: '', username: '', role: 'student' });
    }
    // no update of formData on delete
    // eslint-disable-next-line
  }, [state.type, state.user]);

  // Shared dialog close
  const close = () => setState({ type: null, user: null });

  return (
    <>
      {/* Create/Edit dialog */}
      <Dialog open={state.type === 'create' || state.type === 'edit'} onOpenChange={val => !val && close()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {state.type === 'create' ? "Create New User" : "Edit User"}
            </DialogTitle>
          </DialogHeader>
          <form
            onSubmit={e => {
              e.preventDefault();
              onSubmit(state.type as 'create' | 'edit', formData, state.user?.id);
            }}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label htmlFor="email">{state.type === 'create' ? 'Email' : 'Email'}</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                disabled={state.type === 'edit'}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
            {state.type === 'create' && (
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={e => setFormData({ ...formData, password: e.target.value })}
                  placeholder="********"
                  required
                />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                value={formData.username}
                onChange={e => setFormData({ ...formData, username: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select
                value={formData.role}
                onValueChange={(value: UserRole) => setFormData({ ...formData, role: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="student">Student</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={close}>Cancel</Button>
              <Button type="submit" disabled={loading}>
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                {state.type === 'create' ? 'Create User' : 'Update User'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
      {/* Delete dialog */}
      <Dialog open={state.type === 'delete'} onOpenChange={val => !val && close()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to delete this user? This action cannot be undone.</p>
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={close}>Cancel</Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (state.user?.id) onDelete(state.user.id);
              }}
              disabled={loading}
            >
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
export default UserDialog;
