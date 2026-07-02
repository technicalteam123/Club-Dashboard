import { useState } from 'react';
import { useListAppointments, useUpdateAppointmentStatus } from '@workspace/api-client-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, MapPin, Video, Check, X } from 'lucide-react';
import { toast } from 'sonner';

export default function DoctorAppointments() {
  const [activeTab, setActiveTab] = useState('pending');
  const { data: appointments, refetch } = useListAppointments({ role: 'doctor' });
  const updateStatus = useUpdateAppointmentStatus();

  const handleStatusUpdate = (id: number, status: 'approved' | 'rejected') => {
    updateStatus.mutate({ id, data: { status, confirmedDate: new Date().toISOString() } }, {
      onSuccess: () => {
        toast.success(`Appointment ${status} successfully`);
        refetch();
      }
    });
  };

  const filteredApps = appointments?.filter(a => activeTab === 'pending' ? a.status === 'pending' : a.status !== 'pending') || [];

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div>
        <h1 className="text-3xl font-display font-semibold mb-2">Appointments</h1>
        <p className="text-muted-foreground text-lg">Manage patient consultation requests.</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="pending">Pending Requests</TabsTrigger>
          <TabsTrigger value="confirmed">Confirmed</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6 space-y-4">
          {filteredApps.map(app => (
            <Card key={app.id}>
              <CardContent className="p-6 flex flex-col md:flex-row justify-between items-start gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-lg">{app.userName}</h3>
                    <Badge variant={app.status === 'pending' ? 'secondary' : 'default'} className="capitalize">{app.status}</Badge>
                  </div>
                  
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" /> 
                      {new Date(app.preferredDate).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                    </span>
                    <span className="flex items-center gap-1">
                      {app.mode === 'video' ? <Video className="w-4 h-4" /> : <MapPin className="w-4 h-4" />}
                      {app.mode === 'video' ? 'Video Consult' : `${app.city}, ${app.area}`}
                    </span>
                  </div>

                  {app.notes && (
                    <div className="text-sm bg-muted/50 p-3 rounded-lg border">
                      <span className="font-medium">Patient Note:</span> {app.notes}
                    </div>
                  )}
                </div>

                {app.status === 'pending' && (
                  <div className="flex flex-col gap-2 min-w-[140px]">
                    <Button onClick={() => handleStatusUpdate(app.id, 'approved')} disabled={updateStatus.isPending} className="bg-green-600 hover:bg-green-700 text-white w-full">
                      <Check className="w-4 h-4 mr-2" /> Accept
                    </Button>
                    <Button onClick={() => handleStatusUpdate(app.id, 'rejected')} disabled={updateStatus.isPending} variant="outline" className="w-full text-destructive hover:text-destructive hover:bg-destructive/10">
                      <X className="w-4 h-4 mr-2" /> Decline
                    </Button>
                  </div>
                )}
                
                {app.status === 'approved' && (
                  <Button variant="outline">Join Call / Start</Button>
                )}
              </CardContent>
            </Card>
          ))}
          
          {filteredApps.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              No appointments found in this category.
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
