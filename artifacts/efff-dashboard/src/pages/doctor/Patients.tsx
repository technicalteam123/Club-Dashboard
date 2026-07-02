import { useListDoctorPatients } from '@workspace/api-client-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search, User as UserIcon, Calendar, FileText } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

export default function DoctorPatients() {
  const { data: patients, isLoading } = useListDoctorPatients();
  const [search, setSearch] = useState('');

  if (isLoading) return <div className="p-8 animate-pulse"><div className="h-8 bg-muted rounded w-1/4 mb-8"></div></div>;

  const filtered = patients?.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.email.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-semibold mb-2">My Patients</h1>
          <p className="text-muted-foreground text-lg">Manage your assigned patients and their journeys.</p>
        </div>
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Search patients..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered?.map(patient => (
          <Card key={patient.id} className="hover:border-primary/50 transition-colors cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xl font-medium shrink-0">
                  {patient.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-lg truncate">{patient.name}</h3>
                  <p className="text-sm text-muted-foreground truncate">{patient.email}</p>
                </div>
              </div>
              
              <div className="space-y-3 mt-6 text-sm">
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-muted-foreground">Journey Stage</span>
                  <Badge variant="outline" className="font-normal">{patient.journeyStage}</Badge>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-muted-foreground flex items-center gap-1"><Calendar className="w-4 h-4" /> Last Visit</span>
                  <span className="font-medium">{patient.lastAppointmentDate ? new Date(patient.lastAppointmentDate).toLocaleDateString() : 'Never'}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-muted-foreground flex items-center gap-1"><FileText className="w-4 h-4" /> Reports</span>
                  <span className="font-medium">{patient.reportsCount} uploaded</span>
                </div>
              </div>

              <div className="mt-6 flex gap-2">
                <Button variant="outline" className="flex-1">View Profile</Button>
                <Button className="flex-1">Message</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
