import { useListDoctors } from '@workspace/api-client-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Star, Languages, Video, User as UserIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { Link } from 'wouter';

export default function UserDoctors() {
  const { data: doctors, isLoading } = useListDoctors();
  const [search, setSearch] = useState('');

  if (isLoading) return <div className="p-8 animate-pulse"><div className="h-8 bg-muted rounded w-1/4 mb-8"></div><div className="space-y-4"><div className="h-32 bg-muted rounded"></div></div></div>;

  const filtered = doctors?.filter(d => 
    d.name.toLowerCase().includes(search.toLowerCase()) || 
    d.city.toLowerCase().includes(search.toLowerCase()) ||
    d.specialty.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-semibold mb-2">Doctor Directory</h1>
          <p className="text-muted-foreground text-lg">Find and connect with fertility specialists.</p>
        </div>
        <div className="w-full md:w-72">
          <Input 
            placeholder="Search by name, city, specialty..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered?.map(doc => (
          <Card key={doc.id} className="flex flex-col">
            <CardContent className="p-6 flex-1">
              <div className="flex items-start justify-between mb-4">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  {doc.avatarUrl ? (
                    <img src={doc.avatarUrl} alt={doc.name} className="w-full h-full rounded-full object-cover" />
                  ) : (
                    <UserIcon className="w-8 h-8" />
                  )}
                </div>
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                  {doc.rating.toFixed(1)}
                </Badge>
              </div>
              
              <h3 className="font-semibold text-xl mb-1">{doc.name}</h3>
              <p className="text-primary text-sm font-medium mb-4">{doc.specialty}</p>
              
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 shrink-0" />
                  <span>{doc.city}, {doc.area}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Languages className="w-4 h-4 shrink-0" />
                  <span>{doc.languages.join(', ')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Video className="w-4 h-4 shrink-0" />
                  <span>{doc.consultationModes.join(', ')}</span>
                </div>
              </div>
            </CardContent>
            <div className="p-6 pt-0 mt-auto flex gap-2">
              <Link href="/user/appointments" className="flex-1">
                <Button className="w-full">Book Consult</Button>
              </Link>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
