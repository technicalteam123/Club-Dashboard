import { useState } from 'react';
import { useListCommunityPosts, useCreateCommunityPost, useGetTrendingPosts, useUpvoteCommunityPost, useAddComment } from '@workspace/api-client-react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, ArrowUpCircle, PenSquare, User as UserIcon } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function UserCommunity() {
  const [activeCategory, setActiveCategory] = useState('All');
  const { data: posts, refetch } = useListCommunityPosts(activeCategory !== 'All' ? { category: activeCategory } : {});
  const { data: trending } = useGetTrendingPosts();
  const upvoteMutation = useUpvoteCommunityPost();

  const handleUpvote = (id: number) => {
    upvoteMutation.mutate({ id }, { onSuccess: () => refetch() });
  };

  const categories = ['All', 'Egg Freezing Experience', 'AMH Discussions', 'Recovery Stories', 'Financial Planning', 'Career Planning'];

  return (
    <div className="space-y-8 max-w-6xl mx-auto flex flex-col md:flex-row gap-8">
      <div className="flex-1 space-y-6">
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-display font-semibold mb-2">Community</h1>
            <p className="text-muted-foreground">Safe, supportive discussions.</p>
          </div>
          <Button className="gap-2"><PenSquare className="w-4 h-4" /> New Post</Button>
        </div>

        <Tabs value={activeCategory} onValueChange={setActiveCategory} className="w-full">
          <TabsList className="w-full justify-start overflow-x-auto h-auto p-1 bg-transparent border-b rounded-none mb-6">
            {categories.map(cat => (
              <TabsTrigger 
                key={cat} 
                value={cat}
                className="rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                {cat}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value={activeCategory} className="space-y-4">
            {posts?.map(post => (
              <Card key={post.id} className="hover:border-primary/30 transition-colors">
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    <div className="flex flex-col items-center gap-1 shrink-0">
                      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full text-muted-foreground hover:text-primary hover:bg-primary/10" onClick={() => handleUpvote(post.id)}>
                        <ArrowUpCircle className="w-5 h-5" />
                      </Button>
                      <span className="text-sm font-semibold">{post.upvotes}</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2 text-sm text-muted-foreground">
                        <Badge variant="secondary" className="font-normal">{post.category}</Badge>
                        <span>•</span>
                        <span>{post.isAnonymous ? 'Anonymous' : post.authorName}</span>
                        <span>•</span>
                        <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                      </div>
                      <h3 className="text-lg font-semibold mb-2">{post.title}</h3>
                      <p className="text-muted-foreground text-sm line-clamp-2 mb-4">{post.content}</p>
                      
                      <div className="flex items-center gap-4 text-muted-foreground text-sm">
                        <span className="flex items-center gap-1 hover:text-primary cursor-pointer transition-colors">
                          <MessageSquare className="w-4 h-4" />
                          {post.commentCount} Comments
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>

      <div className="w-full md:w-80 space-y-6 shrink-0 pt-16">
        <Card className="bg-primary/5 border-primary/10">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              🔥 Trending
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {trending?.map(post => (
              <div key={post.id} className="group cursor-pointer">
                <h4 className="font-medium text-sm group-hover:text-primary transition-colors line-clamp-2">{post.title}</h4>
                <p className="text-xs text-muted-foreground mt-1">{post.commentCount} comments</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
