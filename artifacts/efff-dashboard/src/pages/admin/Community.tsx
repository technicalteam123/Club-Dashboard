import { useState } from 'react';
import { useListCommunityPosts, useModeratePost } from '@workspace/api-client-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Trash2, ArrowUpCircle, MessageCircle, ShieldAlert } from 'lucide-react';
import { toast } from 'sonner';

const CATEGORIES = ['All', 'Egg Freezing Experience', 'AMH Discussions', 'Recovery Stories', 'Financial Planning', 'Career Planning'];

export default function AdminCommunity() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const { data: posts, refetch } = useListCommunityPosts(category !== 'All' ? { category } : {});
  const moderateMutation = useModeratePost();

  const handleDelete = (id: number) => {
    if (!confirm('Are you sure you want to remove this post?')) return;
    moderateMutation.mutate({ id }, {
      onSuccess: () => { toast.success('Post removed'); refetch(); }
    });
  };

  const filtered = posts?.filter(p =>
    p.title?.toLowerCase().includes(search.toLowerCase()) ||
    p.content?.toLowerCase().includes(search.toLowerCase()) ||
    p.authorName?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-semibold mb-2">Community Moderation</h1>
          <p className="text-muted-foreground">Review and moderate community posts across all categories.</p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-60">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search posts..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
          </div>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-44"><SelectValue placeholder="Category" /></SelectTrigger>
            <SelectContent>
              {CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-3">
        {filtered?.map(post => (
          <Card key={post.id} className="hover:border-primary/30 transition-colors">
            <CardContent className="p-5">
              <div className="flex items-start gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <p className="font-semibold text-sm truncate">{post.title}</p>
                    {post.isAnonymous && (
                      <Badge variant="outline" className="text-xs">Anonymous</Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{post.content}</p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="font-medium text-foreground">{post.authorName}</span>
                    <Badge variant="secondary" className="text-[10px] font-normal">{post.category}</Badge>
                    <div className="flex items-center gap-1"><ArrowUpCircle className="w-3.5 h-3.5" /> {post.upvotes ?? 0}</div>
                    <div className="flex items-center gap-1"><MessageCircle className="w-3.5 h-3.5" /> {post.commentCount ?? 0}</div>
                    <span>{new Date(post.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                  </div>
                </div>
                <Button
                  size="sm" variant="ghost"
                  className="shrink-0 text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20"
                  onClick={() => handleDelete(post.id)}
                  disabled={moderateMutation.isPending}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {!filtered?.length && (
          <div className="text-center py-16 text-muted-foreground">
            <ShieldAlert className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p>No posts to moderate right now.</p>
          </div>
        )}
      </div>
    </div>
  );
}
