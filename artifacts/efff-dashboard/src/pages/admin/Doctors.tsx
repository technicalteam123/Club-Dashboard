import { useState } from 'react';
import { useListDoctors, useCreateDoctor } from '@workspace/api-client-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Search, Plus, MapPin, Stethoscope, Star } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminDoctors() {
  const { data: doctors, refetch } = useListDoctors({});
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);
  const createDoctor = useCreateDoctor();
  const [form, setForm] = useState({ name: '', specialty: '', city: '', area: '', bio: '' });

  const filtered = doctors?.filter(d =>
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    d.specialty.toLowerCase().includes(search.toLowerCase()) ||
    d.city.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreate = () => {
    if (!form.name || !form.specialty || !form.city) {
      toast.error('Fill in name, specialty, and city.');
      return;
    }
    createDoctor.mutate({
      data: {
        name: form.name,
        specialty: form.specialty,
        city: form.city,
        area: form.area || form.city,
        languages: ['English', 'Hindi'],
        consultationModes: ['in-person', 'video'],
        experienceYears: 5,
        bio: form.bio || undefined,
      }
    }, {
      onSuccess: () => {
        toast.success('Doctor added successfully');
        refetch();
        setOpen(false);
        setForm({ name: '', specialty: '', city: '', area: '', bio: '' });
      }
    });
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-semibold mb-2">Doctor Directory</h1>
          <p className="text-muted-foreground">Manage empanelled doctors on the EFFF platform.</p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search doctors..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2 shrink-0"><Plus className="w-4 h-4" /> Add Doctor</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Add New Doctor</DialogTitle></DialogHeader>
              <div className="space-y-4 mt-2">
                {[
                  { label: 'Full Name', key: 'name', placeholder: 'Dr. Ananya Kapoor' },
                  { label: 'Specialty', key: 'specialty', placeholder: 'Reproductive Endocrinologist' },
                  { label: 'City', key: 'city', placeholder: 'Mumbai' },
                  { label: 'Area / Locality', key: 'area', placeholder: 'Bandra' },
                  { label: 'Short Bio (optional)', key: 'bio', placeholder: 'Expert in egg freezing with 10+ years...' },
                ].map(({ label, key, placeholder }) => (
                  <div key={key}>
                    <Label className="mb-1.5 block">{label}</Label>
                    <Input
                      placeholder={placeholder}
                      value={form[key as keyof typeof form]}
                      onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                    />
                  </div>
                ))}
                <Button className="w-full" onClick={handleCreate} disabled={createDoctor.isPending}>
                  {createDoctor.isPending ? 'Adding...' : 'Add Doctor'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered?.map(doctor => (
          <Card key={doctor.id} className="hover:border-primary/40 transition-colors">
            <CardContent className="p-5">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm shrink-0">
                  {doctor.name.split(' ').filter(p => p !== 'Dr.').map(n => n[0]).slice(0, 2).join('')}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm truncate">{doctor.name}</p>
                  <p className="text-xs text-muted-foreground">{doctor.specialty}</p>
                </div>
                <Badge className={`border-none text-xs shrink-0 ${doctor.availableSlots > 0 ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300' : 'bg-muted text-muted-foreground'}`}>
                  {doctor.availableSlots > 0 ? 'Active' : 'Unavailable'}
                </Badge>
              </div>
              <div className="space-y-1.5 text-xs text-muted-foreground">
                <div className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" />{doctor.city}{doctor.area ? `, ${doctor.area}` : ''}</div>
                <div className="flex items-center gap-1.5"><Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />{doctor.rating.toFixed(1)} · {doctor.experienceYears} yrs exp</div>
              </div>
              <div className="mt-3 pt-3 border-t border-border/50 flex gap-1 flex-wrap">
                {doctor.languages.slice(0, 3).map(l => (
                  <Badge key={l} variant="outline" className="text-[10px] px-1.5 py-0">{l}</Badge>
                ))}
                {doctor.consultationModes.slice(0, 2).map(m => (
                  <Badge key={m} variant="secondary" className="text-[10px] px-1.5 py-0 capitalize">{m}</Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
        {!filtered?.length && (
          <div className="col-span-full text-center py-16 text-muted-foreground">No doctors found.</div>
        )}
      </div>
    </div>
  );
}
