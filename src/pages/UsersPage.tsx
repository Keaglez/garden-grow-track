import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, Shield } from 'lucide-react';
import { useGarden } from '@/context/GardenContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { GardenUser } from '@/types/garden';

const roleBadge: Record<string, string> = {
  owner: 'bg-harvest-gold text-harvest-gold-foreground',
  manager: 'bg-primary text-primary-foreground',
  gardener: 'bg-accent text-accent-foreground',
  viewer: 'bg-muted text-muted-foreground',
};

const UsersPage = () => {
  const { users, addUser, removeUser } = useGarden();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<GardenUser['role']>('gardener');

  const handleAdd = () => {
    if (!name.trim() || !email.trim()) return;
    addUser({
      id: Date.now().toString(),
      name: name.trim(),
      email: email.trim(),
      role,
      joinedDate: new Date().toISOString().split('T')[0],
      avatar: name.trim().split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2),
    });
    setName(''); setEmail(''); setRole('gardener');
    setOpen(false);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Users</h1>
          <p className="mt-1 text-muted-foreground">Manage garden team members</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2"><Plus className="h-4 w-4" /> Add User</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Add Team Member</DialogTitle></DialogHeader>
            <div className="space-y-4 pt-4">
              <Input placeholder="Full name" value={name} onChange={e => setName(e.target.value)} />
              <Input placeholder="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} />
              <Select value={role} onValueChange={v => setRole(v as GardenUser['role'])}>
                <SelectTrigger><SelectValue placeholder="Role" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="owner">Owner</SelectItem>
                  <SelectItem value="manager">Manager</SelectItem>
                  <SelectItem value="gardener">Gardener</SelectItem>
                  <SelectItem value="viewer">Viewer</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={handleAdd} className="w-full">Add Member</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {users.map((user, i) => (
          <motion.div
            key={user.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.1 }}
            className="stat-card group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full garden-gradient text-sm font-bold text-primary-foreground">
                  {user.avatar}
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{user.name}</h3>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </div>
              </div>
              <button
                onClick={() => removeUser(user.id)}
                className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <Badge className={roleBadge[user.role]}>
                <Shield className="h-3 w-3 mr-1" /> {user.role}
              </Badge>
              <span className="text-xs text-muted-foreground">Joined {user.joinedDate}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default UsersPage;
