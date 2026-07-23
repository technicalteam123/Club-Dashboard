import { useGetDoctorDashboard } from '@workspace/api-client-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Users, FileText, Clock, ChevronRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';

export default function DoctorDashboard() {
  const { data: dashboard, isLoading } = useGetDoctorDashboard();

  if (isLoading) return <div className="p-8 animate-pulse"><div className="h-8 bg-muted rounded w-1/4 mb-8"></div></div>;
  if (!dashboard) return null;

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div>
        <h1 className="text-3xl font-display font-semibold mb-2">Doctor Dashboard</h1>
        <p className="text-muted-foreground text-lg">Overview of your practice and upcoming schedule.</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-primary/5 border-primary/10">
          <CardContent className="p-6 flex flex-col justify-center">
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                <Calendar className="w-5 h-5" />
              </div>
              <Badge variant="secondary" className="border-primary/40 bg-primary/15 text-[var(--efff-navy)] hover:bg-primary/20">Today</Badge>
            </div>
            <p className="text-sm font-medium text-muted-foreground mb-1">Today's Appointments</p>
            <h2 className="text-3xl font-display font-bold">{dashboard.todayAppointments}</h2>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex flex-col justify-center">
            <div className="flex justify-between items-start mb-4">
              <div className="icon-warning w-10 h-10 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5" />
              </div>
            </div>
            <p className="text-sm font-medium text-muted-foreground mb-1">Pending Requests</p>
            <h2 className="text-3xl font-display font-bold">{dashboard.pendingAppointments}</h2>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex flex-col justify-center">
            <div className="flex justify-between items-start mb-4">
              <div className="icon-info w-10 h-10 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5" />
              </div>
            </div>
            <p className="text-sm font-medium text-muted-foreground mb-1">Reports to Review</p>
            <h2 className="text-3xl font-display font-bold">{dashboard.pendingReportReviews}</h2>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex flex-col justify-center">
            <div className="flex justify-between items-start mb-4">
              <div className="icon-success w-10 h-10 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
            </div>
            <p className="text-sm font-medium text-muted-foreground mb-1">Total Patients</p>
            <h2 className="text-3xl font-display font-bold">{dashboard.totalPatients}</h2>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="flex flex-col h-full">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg">Recent Appointments</CardTitle>
            <Link href="/doctor/appointments">
              <Button variant="ghost" size="sm" className="text-xs">View All <ChevronRight className="w-3 h-3 ml-1" /></Button>
            </Link>
          </CardHeader>
          <CardContent className="pt-4 flex-1">
            <div className="space-y-4">
              {dashboard.recentAppointments.map(app => (
                <div key={app.id} className="flex items-center justify-between p-3 rounded-lg border bg-card">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                      {app.userName.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{app.userName}</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(app.preferredDate).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                      </p>
                    </div>
                  </div>
                  <Badge variant={app.status === 'pending' ? 'secondary' : 'default'} className="capitalize text-xs">
                    {app.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
