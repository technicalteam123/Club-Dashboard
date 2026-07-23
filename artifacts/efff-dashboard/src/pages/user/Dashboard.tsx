import { useGetDashboardSummary } from '@workspace/api-client-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, ChevronRight, CheckCircle2, Clock, FileText, ArrowRight, Video } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'wouter';

const STAGES = [
  'Awareness', 'Consultation Pending', 'Reports Submitted', 
  'Doctor Assigned', 'Treatment Planning', 'Egg Freezing', 'Complete'
];

export default function UserDashboard() {
  const { data: summary, isLoading } = useGetDashboardSummary();

  if (isLoading) return <div className="p-8 animate-pulse flex space-x-4"><div className="h-12 bg-muted rounded w-1/4"></div></div>;
  if (!summary) return null;

  const currentStageIndex = STAGES.indexOf(summary.journeyStage) !== -1 ? STAGES.indexOf(summary.journeyStage) : 1;

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div>
        <h1 className="text-3xl font-display font-semibold mb-2">Welcome back, {summary.user.name.split(' ')[0]}</h1>
        <p className="text-muted-foreground text-lg">Your fertility journey is right on track.</p>
      </div>

      {/* Journey Tracker */}
      <Card className="overflow-hidden shadow-[0_6px_22px_rgb(0_5_31_/_0.07)]">
        <CardContent className="p-8">
          <div className="flex justify-between items-end mb-8">
            <div>
              <p className="text-sm font-semibold text-[var(--efff-navy)] mb-1">CURRENT STAGE</p>
              <h3 className="text-2xl font-display font-semibold">{summary.journeyStage}</h3>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground mb-1">Progress</p>
              <p className="text-xl font-semibold">{summary.journeyProgress}%</p>
            </div>
          </div>
          
          <div className="relative mt-12 mb-6">
            <div className="absolute top-4 left-0 w-full h-1.5 bg-[#dce4ec] -translate-y-1/2 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-[var(--efff-navy)]" 
                initial={{ width: 0 }}
                animate={{ width: `${summary.journeyProgress}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </div>
            <div className="relative flex justify-between">
              {STAGES.map((stage, idx) => {
                const isCompleted = idx < currentStageIndex;
                const isCurrent = idx === currentStageIndex;
                return (
                  <div key={stage} className="flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center border-4 border-background z-10 transition-colors ${
                      isCompleted ? 'bg-[var(--efff-navy)] text-white' :
                      isCurrent ? 'bg-primary text-[var(--efff-navy)] border-white shadow-[0_0_0_2px_var(--efff-cyan)]' :
                      'bg-[#e8edf2]'
                    }`}>
                      {isCompleted && <CheckCircle2 className="w-4 h-4" />}
                    </div>
                    <span className={`absolute top-10 text-xs text-center w-24 -ml-8 leading-tight hidden md:block ${isCurrent ? 'font-semibold text-foreground' : 'text-muted-foreground'}`}>
                      {stage}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Next Action Card */}
        <Card className="efff-dark-panel md:col-span-2 border-none shadow-[0_12px_30px_rgb(0_5_31_/_0.18)] relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <ArrowRight className="w-32 h-32" />
          </div>
          <CardHeader>
            <CardTitle className="text-primary font-semibold text-sm">NEXT ACTION</CardTitle>
            <CardDescription className="text-3xl font-display font-semibold text-white mt-2 leading-tight">
              {summary.nextAction || 'Book your initial consultation'}
            </CardDescription>
          </CardHeader>
          <CardContent className="mt-4">
            <Button className="rounded-xl px-6 font-semibold">
              Complete Task
            </Button>
          </CardContent>
        </Card>

        {/* Appointments */}
        <Card className="flex flex-col">
          <CardHeader className="pb-4 border-b border-border/50">
            <CardTitle className="text-lg flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              Upcoming
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 flex-1 overflow-y-auto">
            {summary.upcomingAppointments?.length > 0 ? (
              <div className="divide-y divide-border/50">
                {summary.upcomingAppointments.map((app: any) => (
                  <div key={app.id} className="p-4 hover:bg-muted/30 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <p className="font-medium text-sm">Dr. {app.doctorName}</p>
                      <Badge variant="outline" className="text-[10px]">{app.mode}</Badge>
                    </div>
                    <div className="flex items-center text-xs text-muted-foreground gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(app.preferredDate).toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 text-center text-muted-foreground text-sm flex flex-col items-center justify-center h-full">
                <Calendar className="w-8 h-8 opacity-20 mb-3" />
                <p>No upcoming appointments</p>
                <Link href="/user/appointments" className="mt-3 text-[var(--efff-navy)] hover:text-[var(--efff-cyan-hover)] hover:underline">Book one</Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-border/50">
            <CardTitle className="text-lg flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              Recent Reports
            </CardTitle>
            <Link href="/user/reports">
              <Button variant="ghost" size="sm" className="text-xs">View All <ChevronRight className="w-3 h-3 ml-1" /></Button>
            </Link>
          </CardHeader>
          <CardContent className="pt-4">
            {summary.recentReports?.length > 0 ? summary.recentReports.slice(0, 3).map((report: any) => (
              <div key={report.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 mb-2 border border-border/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{report.fileName}</p>
                    <p className="text-xs text-muted-foreground uppercase">{report.type}</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="h-8">View</Button>
              </div>
            )) : (
              <p className="text-center text-sm text-muted-foreground py-4">No reports uploaded yet.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-border/50">
            <CardTitle className="text-lg flex items-center gap-2">
              <Video className="w-5 h-5 text-primary" />
              Upcoming Webinars
            </CardTitle>
            <Link href="/user/webinars">
              <Button variant="ghost" size="sm" className="text-xs">Browse <ChevronRight className="w-3 h-3 ml-1" /></Button>
            </Link>
          </CardHeader>
          <CardContent className="pt-4">
            {summary.upcomingWebinars?.length > 0 ? summary.upcomingWebinars.slice(0, 2).map((webinar: any) => (
              <div key={webinar.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 mb-2 border border-border/50">
                <div>
                  <p className="text-sm font-medium line-clamp-1">{webinar.title}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(webinar.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })} • {webinar.speaker}
                  </p>
                </div>
                <Button size="sm" className="h-8 ml-2 shrink-0">Join</Button>
              </div>
            )) : (
              <p className="text-center text-sm text-muted-foreground py-4">No upcoming webinars.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
