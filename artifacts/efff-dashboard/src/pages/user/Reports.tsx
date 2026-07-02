import { useState } from 'react';
import { useListReports, useCreateReport } from '@workspace/api-client-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, UploadCloud, Stethoscope } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

export default function UserReports() {
  const { data: reports, refetch } = useListReports();
  const createReport = useCreateReport();
  const [activeTab, setActiveTab] = useState('my-reports');

  const handleBookLab = () => {
    createReport.mutate({
      data: {
        type: 'metropolis',
        fileName: 'Pending AMH Test',
        fileUrl: '',
        isLabBooked: true,
        labName: 'Metropolis Healthcare',
        labDate: new Date(Date.now() + 86400000).toISOString()
      }
    }, {
      onSuccess: () => {
        toast.success("Lab test booked with Metropolis!");
        refetch();
        setActiveTab('my-reports');
      }
    });
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div>
        <h1 className="text-3xl font-display font-semibold mb-2">Medical Reports</h1>
        <p className="text-muted-foreground text-lg">Manage your fertility test results and doctor notes.</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="my-reports">My Reports</TabsTrigger>
          <TabsTrigger value="add">Add / Book Test</TabsTrigger>
        </TabsList>

        <TabsContent value="my-reports" className="mt-6 space-y-4">
          {reports?.map(report => (
            <Card key={report.id}>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                      <FileText className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{report.fileName}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary" className="uppercase text-[10px]">{report.type}</Badge>
                        <span className="text-xs text-muted-foreground">
                          {new Date(report.uploadedAt).toLocaleDateString()}
                        </span>
                      </div>
                      
                      {report.isLabBooked && (
                        <div className="mt-3 text-sm bg-amber-50 dark:bg-amber-900/20 text-amber-800 dark:text-amber-200 p-2 rounded flex items-center gap-2">
                          <Stethoscope className="w-4 h-4" />
                          Lab appointment booked at {report.labName}
                        </div>
                      )}

                      {report.doctorNotes && (
                        <div className="mt-4 p-4 rounded-xl bg-muted/50 border border-border">
                          <p className="text-xs font-semibold text-primary mb-1">DOCTOR'S NOTES</p>
                          <p className="text-sm">{report.doctorNotes}</p>
                          {report.recommendations && (
                            <p className="text-sm mt-2 font-medium">Recommendation: {report.recommendations}</p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  <Button variant="outline" disabled={report.isLabBooked && !report.fileUrl}>
                    {report.fileUrl ? 'View PDF' : 'Pending Result'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          {!reports?.length && (
            <div className="text-center py-12 text-muted-foreground">
              No reports uploaded. Book a test or upload existing ones.
            </div>
          )}
        </TabsContent>

        <TabsContent value="add" className="mt-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="border-primary shadow-lg shadow-primary/5">
              <CardHeader>
                <CardTitle>Do you have existing reports?</CardTitle>
                <CardDescription>Upload your AMH or ultrasound reports from another clinic.</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center py-8 border-2 border-dashed border-border rounded-lg m-6 mt-0">
                <UploadCloud className="w-12 h-12 text-muted-foreground mb-4" />
                <p className="text-sm text-muted-foreground mb-4 text-center px-4">Drag and drop PDF files here, or click to browse.</p>
                <Button variant="outline">Select Files</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Need to take a test?</CardTitle>
                <CardDescription>Book a home-collection AMH test with our partner Metropolis Healthcare.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="p-4 bg-muted/50 rounded-lg mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">AMH Blood Test</span>
                    <span className="font-semibold">₹1,500</span>
                  </div>
                  <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside ml-4">
                    <li>Home sample collection</li>
                    <li>Reports in 24 hours</li>
                    <li>Directly uploaded to dashboard</li>
                  </ul>
                </div>
                <Button className="w-full" onClick={handleBookLab} disabled={createReport.isPending}>
                  Book via Metropolis
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
