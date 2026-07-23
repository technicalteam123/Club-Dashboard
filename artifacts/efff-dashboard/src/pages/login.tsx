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
    <div className="min-h-[100dvh] flex items-center justify-center p-4 relative overflow-hidden bg-background">
      
      {/* Decorative blobs */}
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-[var(--efff-navy)]/5 rounded-full blur-3xl" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-5xl grid md:grid-cols-2 gap-8 z-10"
      >
        <div className="efff-dark-panel hidden flex-col justify-center space-y-8 rounded-2xl p-8 shadow-[0_18px_50px_rgb(0_5_31_/_0.18)] md:flex">
          <div>
            <div className="h-16 w-16 rounded-3xl bg-primary flex items-center justify-center mb-6 shadow-xl shadow-primary/20">
              <span className="text-[var(--efff-navy)] font-display font-bold text-4xl">E</span>
            </div>
            <h1 className="text-5xl font-display font-semibold tracking-tight mb-4 text-white">
              Own your fertility journey.
            </h1>
            <p className="text-lg text-white/72 leading-relaxed max-w-md">
              EFFF Club is a premium members portal combining concierge healthcare, financial planning, and a supportive community for women.
            </p>
          </div>
        </div>

        <Card className="border-border bg-white shadow-[0_18px_50px_rgb(0_5_31_/_0.10)] p-2 sm:p-4">
          <CardHeader className="space-y-3 pb-6">
            <CardTitle className="text-2xl text-center">Welcome back</CardTitle>
            <CardDescription className="text-center text-base">Select a role to experience the portal</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={role} onValueChange={handleRoleChange} className="w-full mb-8">
              <TabsList className="grid w-full grid-cols-3 h-12 p-1 bg-[#f3f4f4] rounded-xl border-0">
                <TabsTrigger value="user" className="rounded-lg after:hidden data-[state=active]:bg-primary data-[state=active]:text-[var(--efff-navy)] data-[state=active]:shadow-sm transition-all"><Heart className="w-4 h-4 mr-2" /> User</TabsTrigger>
                <TabsTrigger value="doctor" className="rounded-lg after:hidden data-[state=active]:bg-primary data-[state=active]:text-[var(--efff-navy)] data-[state=active]:shadow-sm transition-all"><Activity className="w-4 h-4 mr-2" /> Doctor</TabsTrigger>
                <TabsTrigger value="admin" className="rounded-lg after:hidden data-[state=active]:bg-primary data-[state=active]:text-[var(--efff-navy)] data-[state=active]:shadow-sm transition-all"><Shield className="w-4 h-4 mr-2" /> Admin</TabsTrigger>
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
                  className="h-12 bg-white"
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
                  className="h-12 bg-white"
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

            <div className="mt-8 p-4 rounded-xl bg-[var(--efff-blue-pale)] border border-[var(--efff-blue-soft)]/50 text-sm space-y-2">
              <p className="font-semibold text-[var(--efff-navy)] mb-1">Demo Credentials Selected:</p>
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
