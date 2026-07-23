import { useState } from 'react';
import { useListWebinars, useRegisterForWebinar, useGetMe } from '@workspace/api-client-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Video, Users, CheckCircle2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

export default function UserWebinars() {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
  const { data: webinars, refetch } = useListWebinars({ status: activeTab });
  const { data: user } = useGetMe();
  const registerMutation = useRegisterForWebinar();

  const handleRegister = (id: number) => {
    registerMutation.mutate({ id }, {
      onSuccess: () => {
        toast.success("Successfully registered for webinar!");
        refetch();
      }
    });
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div>
        <h1 className="text-3xl font-display font-semibold mb-2">Webinars & Events</h1>
        <p className="text-muted-foreground text-lg">Learn directly from top experts.</p>
      </div>

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
        <TabsList className="w-full max-w-md grid grid-cols-2">
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="past">Past Events</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          <div className="grid md:grid-cols-2 gap-6">
            {webinars?.map((webinar: any) => (
              <Card key={webinar.id} className="flex flex-col h-full overflow-hidden">
                <div className="h-3 bg-gradient-to-r from-primary to-accent" />
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant={webinar.type === 'webinar' ? 'default' : 'secondary'} className="uppercase">
                      {webinar.type}
                    </Badge>
                    {webinar.isRegistered && (
                      <Badge variant="success">
                        <CheckCircle2 className="w-3 h-3 mr-1" /> Registered
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-xl line-clamp-2 leading-tight">{webinar.title}</CardTitle>
                  <CardDescription className="text-base text-foreground mt-2 font-medium">By {webinar.speaker}</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 space-y-4">
                  <p className="text-sm text-muted-foreground line-clamp-3">{webinar.description}</p>
                  
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="w-4 h-4 shrink-0 text-primary" />
                      <span>{new Date(webinar.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="w-4 h-4 shrink-0 text-primary" />
                      <span>{webinar.duration} mins</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Users className="w-4 h-4 shrink-0 text-primary" />
                      <span>{webinar.registeredCount}/{webinar.maxCapacity}</span>
                    </div>
                    {webinar.type === 'webinar' && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Video className="w-4 h-4 shrink-0 text-primary" />
                        <span>Online</span>
                      </div>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="bg-muted/30 pt-4 flex items-center justify-between">
                  <div>
                    {activeTab === 'upcoming' && !webinar.isRegistered && (
                      <>
                        {webinar.discountedPrice < webinar.price ? (
                          <div className="flex flex-col">
                            <span className="text-xs text-muted-foreground line-through">₹{webinar.price}</span>
                            <span className="font-semibold text-[var(--efff-navy)]">₹{webinar.discountedPrice} <span className="text-xs font-normal bg-primary/10 text-[var(--efff-navy)] px-1 rounded ml-1">-{webinar.discountPercent}% off</span></span>
                          </div>
                        ) : (
                          <span className="font-semibold">₹{webinar.price}</span>
                        )}
                      </>
                    )}
                  </div>
                  {activeTab === 'upcoming' ? (
                    webinar.isRegistered ? (
                      <Button variant="outline" className="w-full sm:w-auto">Join Link Available Soon</Button>
                    ) : (
                      <Button 
                        onClick={() => handleRegister(webinar.id)}
                        disabled={registerMutation.isPending || webinar.registeredCount >= webinar.maxCapacity}
                      >
                        {webinar.registeredCount >= webinar.maxCapacity ? 'Sold Out' : 'Register Now'}
                      </Button>
                    )
                  ) : (
                    <Button variant="outline" className="w-full">Watch Recording</Button>
                  )}
                </CardFooter>
              </Card>
            ))}
            {!webinars?.length && (
              <div className="col-span-2 text-center py-12 text-muted-foreground">
                No webinars found in this category.
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
