import { useListReports } from '@workspace/api-client-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, FlaskConical, Activity, BookOpen } from 'lucide-react';

const TYPE_ICONS: Record<string, typeof FileText> = {
  amh: FlaskConical,
  fertility: Activity,
  metropolis: BookOpen,
  external: FileText,
  doctor_recommendation: Activity,
};

export default function AdminReports() {
  const { data: reports } = useListReports({});

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div>
        <h1 className="text-3xl font-display font-semibold mb-2">All Reports</h1>
        <p className="text-muted-foreground">Platform-wide fertility report submissions.</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {reports?.map(report => {
          const Icon = TYPE_ICONS[report.type] ?? FileText;
          return (
            <Card key={report.id} className="hover:border-primary/40 transition-colors">
              <CardContent className="p-5">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm truncate capitalize">{report.type?.replace(/_/g, ' ')} Report</p>
                    <p className="text-xs text-muted-foreground">{report.userName}</p>
                  </div>
                  <Badge variant="secondary" className="text-xs capitalize shrink-0">
                    {report.isLabBooked ? 'Lab Booked' : 'Uploaded'}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground font-medium mb-1">{report.fileName}</p>
                {report.doctorNotes && (
                  <p className="text-xs text-muted-foreground line-clamp-2 mb-3 bg-muted/40 rounded-lg px-3 py-2">
                    {report.doctorNotes}
                  </p>
                )}
                {report.labName && (
                  <p className="text-xs text-muted-foreground">Lab: {report.labName}</p>
                )}
                <p className="text-xs text-muted-foreground mt-1">
                  Uploaded {new Date(report.uploadedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </p>
              </CardContent>
            </Card>
          );
        })}
        {!reports?.length && (
          <div className="col-span-full text-center py-16 text-muted-foreground">No reports submitted yet.</div>
        )}
      </div>
    </div>
  );
}
