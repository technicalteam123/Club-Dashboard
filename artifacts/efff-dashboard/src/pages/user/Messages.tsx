import { useState, useRef, useEffect } from 'react';
import { useListMessageThreads, useGetMessageThread, useSendMessage, useGetMe } from '@workspace/api-client-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Send, User as UserIcon } from 'lucide-react';

export default function UserMessages() {
  const { data: threads } = useListMessageThreads();
  const [activeThreadId, setActiveThreadId] = useState<number | null>(null);
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { data: threadDetail, refetch } = useGetMessageThread(activeThreadId as number, { 
    query: { enabled: !!activeThreadId, queryKey: ['getMessageThread', activeThreadId] } 
  });
  
  const sendMessageMutation = useSendMessage();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [threadDetail]);

  // Set initial active thread if not set
  useEffect(() => {
    if (threads && threads.length > 0 && !activeThreadId) {
      setActiveThreadId(threads[0].id);
    }
  }, [threads, activeThreadId]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !activeThreadId) return;

    sendMessageMutation.mutate({
      id: activeThreadId,
      data: { content: message }
    }, {
      onSuccess: () => {
        setMessage('');
        refetch();
      }
    });
  };

  return (
    <div className="h-[calc(100vh-8rem)] max-w-6xl mx-auto flex flex-col md:flex-row gap-6">
      {/* Threads List */}
      <Card className="w-full md:w-80 flex flex-col shrink-0 h-full overflow-hidden">
        <div className="p-4 border-b">
          <h2 className="font-display font-semibold text-xl">Messages</h2>
        </div>
        <div className="flex-1 overflow-y-auto">
          {threads?.map(thread => (
            <div 
              key={thread.id} 
              onClick={() => setActiveThreadId(thread.id)}
              className={`p-4 border-b cursor-pointer transition-colors hover:bg-muted/50 ${activeThreadId === thread.id ? 'bg-primary/5 border-l-4 border-l-primary' : 'border-l-4 border-l-transparent'}`}
            >
              <div className="flex justify-between items-start mb-1">
                <h4 className="font-semibold text-sm">{thread.counterpartName}</h4>
                {thread.unreadCount > 0 && (
                  <Badge className="h-5 w-5 p-0 flex items-center justify-center rounded-full bg-primary">{thread.unreadCount}</Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground mb-1">{thread.counterpartRole}</p>
              <p className="text-sm text-muted-foreground line-clamp-1">{thread.lastMessage}</p>
            </div>
          ))}
          {!threads?.length && (
            <div className="p-6 text-center text-muted-foreground text-sm">No messages yet.</div>
          )}
        </div>
      </Card>

      {/* Chat Area */}
      <Card className="flex-1 flex flex-col h-full overflow-hidden">
        {activeThreadId && threadDetail ? (
          <>
            <div className="p-4 border-b flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <UserIcon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold">{threadDetail.counterpartName}</h3>
                <p className="text-xs text-muted-foreground">{threadDetail.counterpartRole}</p>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/10">
              {threadDetail.messages.map(msg => (
                <div key={msg.id} className={`flex flex-col ${msg.isOwn ? 'items-end' : 'items-start'}`}>
                  <div className={`max-w-[80%] rounded-2xl p-3 px-4 ${msg.isOwn ? 'bg-primary text-primary-foreground rounded-tr-sm' : 'bg-muted rounded-tl-sm'}`}>
                    <p className="text-sm">{msg.content}</p>
                  </div>
                  <span className="text-[10px] text-muted-foreground mt-1 px-1">
                    {new Date(msg.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 border-t bg-background">
              <form onSubmit={handleSend} className="flex gap-2">
                <Input 
                  placeholder="Type your message..." 
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="rounded-full bg-muted/50 border-none h-12 px-6"
                />
                <Button type="submit" size="icon" className="h-12 w-12 rounded-full shrink-0" disabled={sendMessageMutation.isPending || !message.trim()}>
                  <Send className="w-5 h-5" />
                </Button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            Select a conversation to start messaging
          </div>
        )}
      </Card>
    </div>
  );
}
