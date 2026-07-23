import { useListSupportTickets } from '@workspace/api-client-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Clock, CheckCircle2, AlertCircle } from 'lucide-react';

const STATUS_CONFIG = {
  open: { color: 'status-error', icon: AlertCircle },
  in_progress: { color: 'status-warning', icon: Clock },
  resolved: { color: 'status-success', icon: CheckCircle2 },
};

export default function AdminSupport() {
  const { data: tickets } = useListSupportTickets();

  const open = tickets?.filter(t => t.status === 'open').length ?? 0;
  const inProgress = tickets?.filter(t => t.status === 'in_progress').length ?? 0;
  const resolved = tickets?.filter(t => t.status === 'resolved').length ?? 0;

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div>
        <h1 className="text-3xl font-display font-semibold mb-2">Support Ticket Queue</h1>
        <p className="text-muted-foreground">Track and resolve member support requests.</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Open', count: open, color: 'text-error', bg: 'status-error' },
          { label: 'In Progress', count: inProgress, color: 'text-warning', bg: 'status-warning' },
          { label: 'Resolved', count: resolved, color: 'text-success', bg: 'status-success' },
        ].map(({ label, count, color, bg }) => (
          <Card key={label} className={`border ${bg}`}>
            <CardContent className="p-5 text-center">
              <p className={`text-3xl font-display font-bold ${color}`}>{count}</p>
              <p className="text-sm text-muted-foreground mt-1">{label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Ticket list */}
      <div className="space-y-3">
        {tickets?.map(ticket => {
          const cfg = STATUS_CONFIG[ticket.status as keyof typeof STATUS_CONFIG] ?? STATUS_CONFIG.open;
          const StatusIcon = cfg.icon;
          return (
            <Card key={ticket.id} className="hover:border-primary/30 transition-colors">
              <CardContent className="p-5">
                <div className="flex items-start gap-4">
                  <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <p className="font-semibold text-sm">{ticket.subject}</p>
                      <Badge className={`border-none text-xs capitalize flex items-center gap-1 ${cfg.color}`}>
                        <StatusIcon className="w-3 h-3" />
                        {ticket.status.replace('_', ' ')}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2 mb-2">{ticket.message}</p>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="font-medium text-foreground">{ticket.userName ?? `User #${ticket.userId}`}</span>
                      <span>#{ticket.id}</span>
                      <span>{new Date(ticket.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
        {!tickets?.length && (
          <div className="text-center py-16 text-muted-foreground">
            <CheckCircle2 className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p>No open support tickets. Great job!</p>
          </div>
        )}
      </div>
    </div>
  );
}
