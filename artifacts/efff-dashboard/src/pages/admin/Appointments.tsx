import { useState } from 'react';
import { useListAppointments, useUpdateAppointmentStatus } from '@workspace/api-client-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Video, MapPin, CheckCircle, XCircle, Clock } from 'lucide-react';
import { toast } from 'sonner';

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
  approved: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
  completed: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  rejected: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300',
  rescheduled: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
};

export default function AdminAppointments() {
  const { data: appointments, refetch } = useListAppointments({});
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const updateStatus = useUpdateAppointmentStatus();

  const handleStatus = (id: number, status: 'approved' | 'rejected' | 'completed') => {
    updateStatus.mutate({ id, data: { status } }, {
      onSuccess: () => { toast.success(`Appointment ${status}`); refetch(); }
    });
  };

  const filtered = appointments?.filter(a => {
    const matchesSearch =
      a.userName?.toLowerCase().includes(search.toLowerCase()) ||
      a.doctorName?.toLowerCase().includes(search.toLowerCase()) ||
      a.city?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || a.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-semibold mb-2">All Appointments</h1>
          <p className="text-muted-foreground">Review and manage consultation requests across the platform.</p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-36"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
              <SelectItem value="rescheduled">Rescheduled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-muted/50">
              <tr>
                <th className="px-6 py-4 font-medium">Patient</th>
                <th className="px-6 py-4 font-medium">Doctor</th>
                <th className="px-6 py-4 font-medium">Date & Mode</th>
                <th className="px-6 py-4 font-medium">Location</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50 bg-card">
              {filtered?.map(appt => (
                <tr key={appt.id} className="hover:bg-muted/20 transition-colors">
                  <td className="px-6 py-4 font-medium">{appt.userName}</td>
                  <td className="px-6 py-4 text-muted-foreground">{appt.doctorName}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 text-xs">
                      {appt.mode === 'video' ? <Video className="w-3.5 h-3.5 text-blue-500" /> : <MapPin className="w-3.5 h-3.5 text-rose-500" />}
                      <span className="capitalize">{appt.mode}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {new Date(appt.preferredDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground text-xs">{appt.city}{appt.area ? `, ${appt.area}` : ''}</td>
                  <td className="px-6 py-4">
                    <Badge className={`border-none text-xs capitalize ${STATUS_COLORS[appt.status] ?? ''}`}>{appt.status}</Badge>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {appt.status === 'pending' && (
                      <div className="flex gap-1 justify-end">
                        <Button size="sm" variant="ghost" className="h-7 px-2 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                          onClick={() => handleStatus(appt.id, 'approved')} disabled={updateStatus.isPending}>
                          <CheckCircle className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost" className="h-7 px-2 text-rose-600 hover:text-rose-700 hover:bg-rose-50"
                          onClick={() => handleStatus(appt.id, 'rejected')} disabled={updateStatus.isPending}>
                          <XCircle className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                    {appt.status === 'approved' && (
                      <Button size="sm" variant="ghost" className="h-7 px-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                        onClick={() => handleStatus(appt.id, 'completed')} disabled={updateStatus.isPending}>
                        <Clock className="w-4 h-4 mr-1" /> Mark Done
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!filtered?.length && (
            <div className="text-center py-12 text-muted-foreground">No appointments found.</div>
          )}
        </div>
      </Card>
    </div>
  );
}
