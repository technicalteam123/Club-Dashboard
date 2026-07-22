import { useGetAdminAnalytics } from '@workspace/api-client-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Users, UserPlus, Calendar as CalendarIcon, IndianRupee, Activity, Ticket } from 'lucide-react';

const COLORS = ['#8b5cf6', '#f59e0b', '#f43f5e', '#64748b'];

export default function AdminDashboard() {
  const { data: analytics, isLoading } = useGetAdminAnalytics();

  if (isLoading) return <div className="p-8 animate-pulse"><div className="h-8 bg-muted rounded w-1/4 mb-8"></div></div>;
  if (!analytics) return null;

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div>
        <h1 className="text-3xl font-display font-semibold mb-2">Platform Overview</h1>
        <p className="text-muted-foreground text-lg">EFFF Club operations at a glance.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-primary/5 border-primary/10">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary"><Users className="w-5 h-5" /></div>
            </div>
            <p className="text-sm font-medium text-muted-foreground">Total Users</p>
            <h2 className="text-3xl font-display font-bold text-foreground">{analytics.totalUsers}</h2>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-600"><IndianRupee className="w-5 h-5" /></div>
            </div>
            <p className="text-sm font-medium text-muted-foreground">Monthly MRR</p>
            <h2 className="text-3xl font-display font-bold">₹{(analytics.totalRevenue / 1000).toFixed(1)}k</h2>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-600"><CalendarIcon className="w-5 h-5" /></div>
            </div>
            <p className="text-sm font-medium text-muted-foreground">Pending Appointments</p>
            <h2 className="text-3xl font-display font-bold">{analytics.pendingAppointments}</h2>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-lg bg-rose-500/10 flex items-center justify-center text-rose-600"><Ticket className="w-5 h-5" /></div>
            </div>
            <p className="text-sm font-medium text-muted-foreground">Open Support Tickets</p>
            <h2 className="text-3xl font-display font-bold">{analytics.openTickets}</h2>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Membership Breakdown Donut Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Membership Distribution</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px] flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={analytics.membershipBreakdown}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="count"
                  nameKey="plan"
                >
                  {analytics.membershipBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number, name: string) => [value, name.charAt(0).toUpperCase() + name.slice(1)]}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Appointments Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Appointments Trend</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics.appointmentsByMonth}>
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                <Tooltip cursor={{ fill: 'rgba(0,0,0,0.05)' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}/>
                <Bar dataKey="count" fill="#c04874" radius={[4, 4, 0, 0]} maxBarSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
