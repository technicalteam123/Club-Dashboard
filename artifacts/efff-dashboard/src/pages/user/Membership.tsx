import { useGetMe, useLogout } from '@workspace/api-client-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check } from 'lucide-react';

const PLANS = [
  {
    id: 'basic',
    name: 'Basic',
    price: '₹0',
    fee: '7%',
    discount: '20%',
    features: ['Access to community', 'Basic fertility resources', 'Book appointments']
  },
  {
    id: 'gold',
    name: 'Gold',
    price: '₹999',
    fee: '3.5%',
    discount: '40%',
    features: ['Everything in Basic', 'Dedicated care coordinator', 'Financial SIP tools', 'Priority appointments']
  },
  {
    id: 'platinum',
    name: 'Platinum',
    price: '₹4,999',
    fee: '2.5%',
    discount: '50%',
    features: ['Everything in Gold', 'Free AMH blood test', 'One free consultation', 'Partner loan discounts']
  },
  {
    id: 'femmeelite',
    name: 'FemmeElite',
    price: '₹9,999',
    fee: '1.5%',
    discount: '60%',
    features: ['Everything in Platinum', 'Concierge service', 'Egg freezing storage discount', 'Full psychological support']
  }
];

export default function UserMembership() {
  const { data: user } = useGetMe();

  if (!user) return null;

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div>
        <h1 className="text-3xl font-display font-semibold mb-2">Membership Plans</h1>
        <p className="text-muted-foreground text-lg">Choose a plan that fits your fertility journey needs.</p>
      </div>

      <div className="mb-12">
        <Card className="bg-gradient-to-r from-primary/10 to-transparent border-primary/20">
          <CardContent className="p-6 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <p className="text-sm font-semibold text-[var(--efff-navy)] mb-1">CURRENT PLAN</p>
              <h2 className="text-3xl font-display font-bold">{user.membershipPlan.toUpperCase()}</h2>
              <p className="text-sm text-muted-foreground mt-2">
                You are currently on the {user.membershipPlan} plan. Upgrade to save more on platform fees and seminars.
              </p>
            </div>
            <Button size="lg" className="shrink-0" variant="default">Manage Billing</Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {PLANS.map(plan => {
          const isCurrent = user.membershipPlan === plan.id;
          return (
            <Card key={plan.id} className={`relative flex flex-col ${isCurrent ? 'border-primary shadow-lg shadow-primary/10' : 'border-border'}`}>
              {isCurrent && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <Badge className="border-transparent bg-primary text-[var(--efff-navy)]">Current Plan</Badge>
                </div>
              )}
              <CardHeader>
                <CardTitle className="text-xl">{plan.name}</CardTitle>
                <div className="mt-4">
                  <span className="text-3xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground text-sm">/month</span>
                </div>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between items-center text-sm border-b pb-2">
                    <span className="text-muted-foreground">Platform Fee</span>
                    <span className="font-semibold">{plan.fee}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm border-b pb-2">
                    <span className="text-muted-foreground">Seminar Discount</span>
                    <span className="font-semibold">{plan.discount}</span>
                  </div>
                </div>
                <ul className="space-y-3 text-sm">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <div className="p-6 pt-0 mt-auto">
                <Button 
                  className="w-full" 
                  variant={isCurrent ? "outline" : "default"}
                  disabled={isCurrent}
                >
                  {isCurrent ? 'Current Plan' : 'Upgrade'}
                </Button>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
