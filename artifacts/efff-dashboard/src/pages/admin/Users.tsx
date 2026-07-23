import { useListUsers, useUpdateUserMembership } from '@workspace/api-client-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search, Edit } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export default function AdminUsers() {
  const { data: users, refetch } = useListUsers();
  const [search, setSearch] = useState('');
  const updateMembership = useUpdateUserMembership();

  const handleUpgrade = (id: number) => {
    updateMembership.mutate({ id, data: { membershipPlan: 'platinum' } }, {
      onSuccess: () => {
        toast.success("User upgraded to Platinum");
        refetch();
      }
    });
  };

  const filtered = users?.filter(u => u.role === 'user' && (u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())));

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-semibold mb-2">User Management</h1>
          <p className="text-muted-foreground">View and manage member accounts.</p>
        </div>
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Search users..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-muted/50">
              <tr>
                <th className="px-6 py-4 font-medium">Member</th>
                <th className="px-6 py-4 font-medium">Plan</th>
                <th className="px-6 py-4 font-medium">Journey Stage</th>
                <th className="px-6 py-4 font-medium">Joined Date</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50 bg-card">
              {filtered?.map(user => (
                <tr key={user.id} className="hover:bg-muted/20 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium text-foreground">{user.name}</div>
                    <div className="text-muted-foreground">{user.email}</div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant="outline" className={`uppercase ${user.membershipPlan === 'platinum' ? 'border-primary text-[var(--efff-navy)]' : ''}`}>
                      {user.membershipPlan}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant="secondary" className="font-normal">{user.journeyStage}</Badge>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Button variant="ghost" size="sm" onClick={() => handleUpgrade(user.id)} disabled={user.membershipPlan === 'platinum' || updateMembership.isPending}>
                      <Edit className="w-4 h-4 mr-2" /> Upgrade
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!filtered?.length && (
            <div className="text-center py-12 text-muted-foreground">
              No users found matching search.
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
