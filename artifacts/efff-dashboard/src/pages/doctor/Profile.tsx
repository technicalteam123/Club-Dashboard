import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export default function DoctorProfile() {
  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-display font-semibold mb-2">Doctor Profile</h1>
        <p className="text-muted-foreground text-lg">Manage your public directory listing.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Professional Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Full Name</Label>
              <Input defaultValue="Dr. Jatin Shah" />
            </div>
            <div className="space-y-2">
              <Label>Specialty</Label>
              <Input defaultValue="OB-GYN, Fertility Specialist" />
            </div>
            <div className="space-y-2">
              <Label>City</Label>
              <Input defaultValue="Mumbai" />
            </div>
            <div className="space-y-2">
              <Label>Clinic Area</Label>
              <Input defaultValue="Colaba" />
            </div>
            <div className="space-y-2">
              <Label>Experience (Years)</Label>
              <Input defaultValue="15" type="number" />
            </div>
            <div className="space-y-2">
              <Label>Languages Spoken</Label>
              <Input defaultValue="English, Hindi, Marathi" />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Bio / Introduction</Label>
            <Textarea 
              defaultValue="Specializing in advanced ART techniques and personalized egg freezing protocols. Dedicated to patient education and empowering women to take control of their fertility timeline." 
              className="min-h-[120px]"
            />
          </div>

          <div className="flex justify-end">
            <Button>Save Changes</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
