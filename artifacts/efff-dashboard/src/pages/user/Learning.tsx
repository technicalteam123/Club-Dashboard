import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, Video, FileText, ChevronRight, PlayCircle } from 'lucide-react';

const CATEGORIES = [
  { id: 'basics', title: 'Fertility Basics', icon: BookOpen, count: 12 },
  { id: 'process', title: 'Treatment Process', icon: FileText, count: 8 },
  { id: 'financial', title: 'Financial Planning', icon: BookOpen, count: 5 },
  { id: 'mental', title: 'Mental Wellness', icon: FileText, count: 10 },
];

const RECENT_ARTICLES = [
  { id: 1, title: 'Understanding AMH Levels', category: 'Fertility Basics', readTime: '5 min', type: 'article' },
  { id: 2, title: 'What to expect during stimulation', category: 'Treatment Process', readTime: '8 min', type: 'article' },
  { id: 3, title: 'Egg Freezing vs Embryo Freezing', category: 'Fertility Basics', readTime: '6 min', type: 'video' },
  { id: 4, title: 'Managing work during your cycle', category: 'Mental Wellness', readTime: '4 min', type: 'article' },
];

export default function UserLearning() {
  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div>
        <h1 className="text-3xl font-display font-semibold mb-2">Learning Center</h1>
        <p className="text-muted-foreground text-lg">Knowledge is power on your fertility journey.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {CATEGORIES.map(cat => {
          const Icon = cat.icon;
          return (
            <Card key={cat.id} className="hover:border-primary cursor-pointer transition-all hover:shadow-md">
              <CardContent className="p-6 flex flex-col items-center text-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-medium text-sm">{cat.title}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{cat.count} resources</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="mt-12">
        <h2 className="text-2xl font-display font-semibold mb-6 flex items-center justify-between">
          Recommended for you
          <Button variant="ghost" className="text-sm">View all <ChevronRight className="w-4 h-4 ml-1" /></Button>
        </h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          {RECENT_ARTICLES.map(article => (
            <Card key={article.id} className="overflow-hidden group cursor-pointer">
              <div className="h-32 bg-muted relative">
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-accent/20" />
                {article.type === 'video' && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <PlayCircle className="w-12 h-12 text-white opacity-80 group-hover:scale-110 transition-transform" />
                  </div>
                )}
              </div>
              <CardContent className="p-5">
                <p className="text-xs font-medium text-primary mb-2 uppercase tracking-wider">{article.category}</p>
                <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">{article.title}</h3>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <ClockIcon className="w-3 h-3" /> {article.readTime} read
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

function ClockIcon(props: any) {
  return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;
}
