import { useState } from 'react';
import { useLogin } from '@workspace/api-client-react';
import { useAuth } from '@/contexts/AuthContext';
import { useLocation } from 'wouter';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Activity, Heart, Shield } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Login() {
  const [email, setEmail] = useState('user@efffclub.com');
  const [password, setPassword] = useState('password123');
  const [role, setRole] = useState('user');
  
  const loginMutation = useLogin();
  const { login } = useAuth();
  const [, setLocation] = useLocation();

  const handleRoleChange = (newRole: string) => {
    setRole(newRole);
    if (newRole === 'user') setEmail('user@efffclub.com');
    if (newRole === 'doctor') setEmail('doctor@efffclub.com');
    if (newRole === 'admin') setEmail('admin@efffclub.com');
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate({ data: { email, password } }, {
      onSuccess: (data) => {
        login(data.user, data.token);
        setLocation(`/${data.user.role}/dashboard`);
      }
    });
  };

  return (
    <div className="min-h-[100dvh] flex items-center justify-center p-4 relative overflow-hidden bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-rose-100 via-background to-plum-100 dark:from-rose-950/40 dark:via-background dark:to-plum-950/40">
      <div className="absolute inset-0 bg-white/40 dark:bg-black/40 backdrop-blur-[100px]" />
      
      {/* Decorative blobs */}
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-accent/20 rounded-full blur-3xl" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-5xl grid md:grid-cols-2 gap-8 z-10"
      >
        <div className="flex flex-col justify-center space-y-8 p-8 hidden md:flex">
          <div>
            <div className="h-16 w-16 rounded-3xl bg-primary flex items-center justify-center mb-6 shadow-xl shadow-primary/20">
              <span className="text-primary-foreground font-display font-bold text-4xl">E</span>
            </div>
            <h1 className="text-5xl font-display font-semibold tracking-tight mb-4 bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
              Own your fertility journey.
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-md">
              EFFF Club is a premium members portal combining concierge healthcare, financial planning, and a supportive community for women.
            </p>
          </div>
        </div>

        <Card className="glass-panel border-white/40 dark:border-white/10 shadow-2xl p-2 sm:p-4">
          <CardHeader className="space-y-3 pb-6">
            <CardTitle className="text-2xl text-center">Welcome back</CardTitle>
            <CardDescription className="text-center text-base">Select a role to experience the portal</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={role} onValueChange={handleRoleChange} className="w-full mb-8">
              <TabsList className="grid w-full grid-cols-3 h-12 p-1 bg-muted/50 rounded-xl">
                <TabsTrigger value="user" className="rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-secondary data-[state=active]:shadow-sm transition-all"><Heart className="w-4 h-4 mr-2" /> User</TabsTrigger>
                <TabsTrigger value="doctor" className="rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-secondary data-[state=active]:shadow-sm transition-all"><Activity className="w-4 h-4 mr-2" /> Doctor</TabsTrigger>
                <TabsTrigger value="admin" className="rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-secondary data-[state=active]:shadow-sm transition-all"><Shield className="w-4 h-4 mr-2" /> Admin</TabsTrigger>
              </TabsList>
            </Tabs>

            <form onSubmit={onSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required 
                  className="h-12 bg-white/50 dark:bg-black/20 focus-visible:ring-primary/50"
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <span className="text-xs text-muted-foreground cursor-pointer hover:text-primary transition-colors">Forgot password?</span>
                </div>
                <Input 
                  id="password" 
                  type="password" 
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required 
                  className="h-12 bg-white/50 dark:bg-black/20 focus-visible:ring-primary/50"
                />
              </div>
              
              <div className="pt-2">
                <Button 
                  type="submit" 
                  className="w-full h-12 text-base rounded-xl font-medium shadow-lg shadow-primary/20"
                  disabled={loginMutation.isPending}
                >
                  {loginMutation.isPending ? 'Signing in...' : 'Sign In'}
                </Button>
              </div>
            </form>

            <div className="mt-8 p-4 rounded-xl bg-primary/5 border border-primary/10 text-sm space-y-2">
              <p className="font-semibold text-primary mb-1">Demo Credentials Selected:</p>
              {role === 'user' && <p className="text-muted-foreground">Priya Sharma • Platinum Member • Consultation Pending</p>}
              {role === 'doctor' && <p className="text-muted-foreground">Dr. Jatin Shah • OB-GYN • Mumbai</p>}
              {role === 'admin' && <p className="text-muted-foreground">EFFF Admin • Full Access</p>}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
