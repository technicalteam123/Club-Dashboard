import { useState } from 'react';
import { useListAppointments, useGetRecommendedDoctors, useCreateAppointment } from '@workspace/api-client-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar as CalendarIcon, Clock, MapPin, Video, User as UserIcon } from 'lucide-react';
import { toast } from 'sonner';

export default function UserAppointments() {
  const { data: appointments, refetch } = useListAppointments({ role: 'user' });
  const [activeTab, setActiveTab] = useState('upcoming');
  const [bookingCity, setBookingCity] = useState('');
  
  const { data: doctors } = useGetRecommendedDoctors({ city: bookingCity }, { query: { enabled: bookingCity.length > 2, queryKey: ['getRecommendedDoctors', bookingCity] } });
  const createAppointment = useCreateAppointment();

  const handleBook = (doctorId: number) => {
    createAppointment.mutate({
      data: {
        doctorId,
        city: bookingCity,
        area: 'Central',
        language: 'English',
        mode: 'in-person',
        preferredDate: new Date(Date.now() + 86400000 * 2).toISOString(), // mock date
        notes: 'Initial consultation request'
      }
    }, {
      onSuccess: () => {
        toast.success("Appointment requested successfully!");
        refetch();
        setActiveTab('upcoming');
      }
    });
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div>
        <h1 className="text-3xl font-display font-semibold mb-2">Appointments</h1>
        <p className="text-muted-foreground text-lg">Manage your consultations and checkups.</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="upcoming">My Appointments</TabsTrigger>
          <TabsTrigger value="book">Book New</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="mt-6 space-y-4">
          {appointments?.map(app => (
            <Card key={app.id}>
              <CardContent className="p-6 flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                    <UserIcon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Dr. {app.doctorName}</h3>
                    <div className="flex flex-wrap gap-4 mt-2 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1"><CalendarIcon className="w-4 h-4" /> {new Date(app.preferredDate).toLocaleDateString()}</span>
                      <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {app.city}, {app.area}</span>
                      <span className="flex items-center gap-1"><Video className="w-4 h-4" /> {app.mode}</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <Badge variant={app.status === 'approved' ? 'default' : 'secondary'} className="capitalize">{app.status}</Badge>
                  {app.status === 'pending' && <Button variant="outline" size="sm" className="mt-2">Reschedule</Button>}
                </div>
              </CardContent>
            </Card>
          ))}
          {!appointments?.length && (
            <div className="text-center py-12 text-muted-foreground">
              No appointments found. Book a new one to get started.
            </div>
          )}
        </TabsContent>

        <TabsContent value="book" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Find a Specialist</CardTitle>
              <CardDescription>Search by city to find recommended doctors near you.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2 max-w-sm">
                <Label>City</Label>
                <Input placeholder="e.g. Mumbai, Delhi" value={bookingCity} onChange={e => setBookingCity(e.target.value)} />
              </div>

              {doctors && doctors.length > 0 && (
                <div className="space-y-4">
                  <h4 className="font-medium text-sm text-muted-foreground">RECOMMENDED DOCTORS</h4>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {doctors.map(doc => (
                      <Card key={doc.id} className="bg-muted/30">
                        <CardContent className="p-4">
                          <h4 className="font-semibold">{doc.name}</h4>
                          <p className="text-sm text-muted-foreground">{doc.specialty}</p>
                          <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1"><MapPin className="w-3 h-3" />{doc.city}</p>
                          <Button className="w-full mt-4" size="sm" onClick={() => handleBook(doc.id)} disabled={createAppointment.isPending}>
                            Request Appointment
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
