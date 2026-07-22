import { useState } from 'react';
import { useListWebinars, useCreateWebinar } from '@workspace/api-client-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Users, Calendar, IndianRupee } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminWebinars() {
  const { data: webinars, refetch } = useListWebinars({});
  const createWebinar = useCreateWebinar();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ title: '', speaker: '', description: '', date: '', price: '', maxCapacity: '', type: 'webinar' as 'webinar' | 'seminar' });

  const set = (key: string, val: string) => setForm(f => ({ ...f, [key]: val }));

  const handleCreate = () => {
    if (!form.title || !form.speaker || !form.date) { toast.error('Fill in title, speaker, and date.'); return; }
    createWebinar.mutate({
      data: {
        title: form.title,
        speaker: form.speaker,
        description: form.description,
        date: new Date(form.date).toISOString(),
        type: form.type,
        duration: 60,
        price: Number(form.price) || 999,
        maxCapacity: Number(form.maxCapacity) || 100,
      }
    }, {
      onSuccess: () => { toast.success('Webinar created!'); refetch(); setOpen(false); }
    });
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-semibold mb-2">Webinar Management</h1>
          <p className="text-muted-foreground">Schedule and manage expert-led online sessions.</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2"><Plus className="w-4 h-4" /> Create Webinar</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader><DialogTitle>New Webinar</DialogTitle></DialogHeader>
            <div className="space-y-3 mt-2">
              <div><Label className="mb-1.5 block">Title</Label>
                <Input placeholder="Understanding AMH Levels" value={form.title} onChange={e => set('title', e.target.value)} /></div>
              <div><Label className="mb-1.5 block">Speaker</Label>
                <Input placeholder="Dr. Ananya Kapoor" value={form.speaker} onChange={e => set('speaker', e.target.value)} /></div>
              <div><Label className="mb-1.5 block">Description</Label>
                <Textarea placeholder="What attendees will learn..." rows={3} value={form.description} onChange={e => set('description', e.target.value)} /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label className="mb-1.5 block">Date & Time</Label>
                  <Input type="datetime-local" value={form.date} onChange={e => set('date', e.target.value)} /></div>
                <div><Label className="mb-1.5 block">Type</Label>
                  <Select value={form.type} onValueChange={v => setForm(f => ({ ...f, type: v as 'webinar' | 'seminar' }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="webinar">Webinar (Online)</SelectItem>
                      <SelectItem value="seminar">Seminar (In-person)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label className="mb-1.5 block">Price (₹)</Label>
                  <Input type="number" placeholder="999" value={form.price} onChange={e => set('price', e.target.value)} /></div>
                <div><Label className="mb-1.5 block">Max Capacity</Label>
                  <Input type="number" placeholder="100" value={form.maxCapacity} onChange={e => set('maxCapacity', e.target.value)} /></div>
              </div>
              <Button className="w-full" onClick={handleCreate} disabled={createWebinar.isPending}>
                {createWebinar.isPending ? 'Creating...' : 'Create Webinar'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {webinars?.map(w => {
          const isPast = new Date(w.date) < new Date();
          return (
            <Card key={w.id} className="hover:border-primary/40 transition-colors">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start gap-2">
                  <CardTitle className="text-base leading-snug">{w.title}</CardTitle>
                  <Badge className={`shrink-0 border-none text-xs capitalize ${isPast ? 'bg-muted text-muted-foreground' : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300'}`}>
                    {isPast ? 'Past' : 'Upcoming'}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">{w.speaker}</p>
              </CardHeader>
              <CardContent className="space-y-2 text-xs text-muted-foreground">
                <div className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" />
                  {new Date(w.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </div>
                <div className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5" />
                  {w.registeredCount} / {w.maxCapacity} registered
                </div>
                <div className="flex items-center gap-1.5"><IndianRupee className="w-3.5 h-3.5" />
                  ₹{w.price}
                  <Badge variant="secondary" className="text-[10px] capitalize ml-1">{w.type}</Badge>
                </div>
              </CardContent>
            </Card>
          );
        })}
        {!webinars?.length && (
          <div className="col-span-full text-center py-16 text-muted-foreground">No webinars scheduled. Create your first one!</div>
        )}
      </div>
    </div>
  );
}
