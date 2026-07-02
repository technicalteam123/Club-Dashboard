import { useState } from 'react';
import { useListSupportTickets, useCreateSupportTicket } from '@workspace/api-client-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

export default function UserSupport() {
  const { data: tickets, refetch } = useListSupportTickets();
  const createTicket = useCreateSupportTicket();
  
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState('tickets');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createTicket.mutate({
      data: { subject, message }
    }, {
      onSuccess: () => {
        toast.success("Support ticket created successfully");
        setSubject('');
        setMessage('');
        refetch();
        setActiveTab('tickets');
      }
    });
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div>
        <h1 className="text-3xl font-display font-semibold mb-2">Help & Support</h1>
        <p className="text-muted-foreground text-lg">We're here to help with your account or journey.</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="tickets">My Tickets</TabsTrigger>
          <TabsTrigger value="create">New Ticket</TabsTrigger>
        </TabsList>

        <TabsContent value="tickets" className="mt-6 space-y-4">
          {tickets?.map(ticket => (
            <Card key={ticket.id}>
              <CardContent className="p-6 flex justify-between items-start gap-4">
                <div>
                  <h3 className="font-semibold text-lg mb-1">{ticket.subject}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{ticket.message}</p>
                  <p className="text-xs text-muted-foreground">
                    Created on {new Date(ticket.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <Badge variant={ticket.status === 'resolved' ? 'secondary' : ticket.status === 'in_progress' ? 'default' : 'outline'} className="capitalize">
                  {ticket.status.replace('_', ' ')}
                </Badge>
              </CardContent>
            </Card>
          ))}
          {!tickets?.length && (
            <div className="text-center py-12 text-muted-foreground">
              No support tickets found.
            </div>
          )}
        </TabsContent>

        <TabsContent value="create" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Create Support Ticket</CardTitle>
              <CardDescription>Describe your issue and our team will get back to you within 24 hours.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label>Subject</Label>
                  <Input 
                    value={subject} 
                    onChange={e => setSubject(e.target.value)} 
                    placeholder="Brief description of the issue"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Message</Label>
                  <Textarea 
                    value={message} 
                    onChange={e => setMessage(e.target.value)} 
                    placeholder="Provide details about your issue..."
                    className="min-h-[150px]"
                    required
                  />
                </div>
                <Button type="submit" disabled={createTicket.isPending}>
                  {createTicket.isPending ? 'Submitting...' : 'Submit Ticket'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
