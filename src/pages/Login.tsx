import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Leaf, LogIn } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(email, password)) {
      navigate('/');
    } else {
      toast({ title: 'Login failed', description: 'Invalid email or password.', variant: 'destructive' });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl garden-gradient">
            <Leaf className="h-7 w-7 text-primary-foreground" />
          </div>
          <CardTitle className="text-2xl font-bold">GardenTrack</CardTitle>
          <CardDescription>Sign in to manage your shop</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="admin@gardentrack.co.za" value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required />
            </div>
            <Button type="submit" className="w-full gap-2">
              <LogIn className="h-4 w-4" /> Sign In
            </Button>
          </form>
          <p className="mt-4 text-xs text-center text-muted-foreground">
            Demo: admin@gardentrack.co.za / admin123
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
