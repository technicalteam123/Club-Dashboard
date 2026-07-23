import { useListReports, useAddReportNote } from '@workspace/api-client-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { FileText, User as UserIcon } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export default function DoctorReports() {
  const { data: reports, refetch } = useListReports();
  const addNoteMutation = useAddReportNote();
  const [activeReportId, setActiveReportId] = useState<number | null>(null);
  const [notes, setNotes] = useState('');
  const [recommendations, setRecommendations] = useState('');

  const handleSaveNote = (id: number) => {
    addNoteMutation.mutate({ id, data: { doctorNotes: notes, recommendations } }, {
      onSuccess: () => {
        toast.success("Notes saved successfully");
        setActiveReportId(null);
        setNotes('');
        setRecommendations('');
        refetch();
      }
    });
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div>
        <h1 className="text-3xl font-display font-semibold mb-2">Patient Reports</h1>
        <p className="text-muted-foreground text-lg">Review medical reports and provide clinical recommendations.</p>
      </div>

      <div className="space-y-4">
        {reports?.map(report => (
          <Card key={report.id} className={activeReportId === report.id ? 'border-primary shadow-md' : ''}>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-lg">{report.fileName}</h3>
                      <Badge variant="secondary" className="uppercase text-[10px]">{report.type}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground flex items-center gap-1 mb-2">
                      <UserIcon className="w-4 h-4" /> {report.userName} • Uploaded {new Date(report.uploadedAt).toLocaleDateString()}
                    </p>
                    
                    {report.doctorNotes && activeReportId !== report.id && (
                      <div className="mt-3 p-3 rounded bg-muted/50 border text-sm">
                        <p className="font-medium text-[var(--efff-navy)] mb-1">Your Notes:</p>
                        <p className="text-muted-foreground">{report.doctorNotes}</p>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button variant="outline" disabled={!report.fileUrl}>View PDF</Button>
                  {activeReportId !== report.id ? (
                    <Button onClick={() => {
                      setActiveReportId(report.id);
                      setNotes(report.doctorNotes || '');
                      setRecommendations(report.recommendations || '');
                    }}>
                      {report.doctorNotes ? 'Edit Notes' : 'Add Notes'}
                    </Button>
                  ) : (
                    <Button variant="ghost" onClick={() => setActiveReportId(null)}>Cancel</Button>
                  )}
                </div>
              </div>

              {activeReportId === report.id && (
                <div className="mt-6 pt-6 border-t space-y-4 animate-in fade-in slide-in-from-top-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Clinical Notes</label>
                    <Textarea 
                      value={notes} 
                      onChange={e => setNotes(e.target.value)} 
                      placeholder="Enter your clinical observations here..."
                      className="min-h-[100px]"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Recommendations for Patient</label>
                    <Textarea 
                      value={recommendations} 
                      onChange={e => setRecommendations(e.target.value)} 
                      placeholder="These will be visible to the patient on their dashboard..."
                    />
                  </div>
                  <div className="flex justify-end">
                    <Button onClick={() => handleSaveNote(report.id)} disabled={addNoteMutation.isPending}>
                      Save Notes & Notify Patient
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
        {!reports?.length && (
          <div className="text-center py-12 text-muted-foreground border rounded-xl border-dashed">
            No reports currently require your review.
          </div>
        )}
      </div>
    </div>
  );
}
