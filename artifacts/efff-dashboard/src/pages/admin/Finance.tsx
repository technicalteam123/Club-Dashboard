import { useListLoanOffers } from '@workspace/api-client-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShieldCheck, IndianRupee, TrendingUp, Landmark, Percent } from 'lucide-react';

const MEMBERSHIP_FEES: { plan: string; platform: string; seminar: string; price: string }[] = [
  { plan: 'Basic',       platform: '7%',   seminar: '20%', price: 'Free' },
  { plan: 'Gold',        platform: '3.5%', seminar: '40%', price: '₹999/mo' },
  { plan: 'Platinum',    platform: '2.5%', seminar: '50%', price: '₹4,999/mo' },
  { plan: 'FemmeElite',  platform: '1.5%', seminar: '60%', price: '₹9,999/mo' },
];

export default function AdminFinance() {
  const { data: loans } = useListLoanOffers();

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div>
        <h1 className="text-3xl font-display font-semibold mb-2">Finance & Loan Partners</h1>
        <p className="text-muted-foreground">Manage partner loan offers and platform fee structure.</p>
      </div>

      {/* Membership Fee Structure */}
      <div>
        <h2 className="text-xl font-display font-semibold mb-4 flex items-center gap-2">
          <Percent className="w-5 h-5 text-primary" /> Membership Fee Structure
        </h2>
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground uppercase bg-muted/50">
                <tr>
                  <th className="px-6 py-4 font-medium">Plan</th>
                  <th className="px-6 py-4 font-medium">Price</th>
                  <th className="px-6 py-4 font-medium">Platform Fee</th>
                  <th className="px-6 py-4 font-medium">Seminar Discount</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50 bg-card">
                {MEMBERSHIP_FEES.map(row => (
                  <tr key={row.plan} className="hover:bg-muted/20 transition-colors">
                    <td className="px-6 py-4 font-semibold">{row.plan}</td>
                    <td className="px-6 py-4 text-primary font-medium">{row.price}</td>
                    <td className="px-6 py-4">{row.platform}</td>
                    <td className="px-6 py-4">{row.seminar}</td>
                    <td className="px-6 py-4">
                      <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 border-none text-xs">Active</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* Loan Partner Cards */}
      <div>
        <h2 className="text-xl font-display font-semibold mb-4 flex items-center gap-2">
          <Landmark className="w-5 h-5 text-primary" /> Partner Loan Offers
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {loans?.map(loan => (
            <Card key={loan.id} className="hover:border-primary/40 transition-colors">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-base">{loan.bankName}</CardTitle>
                  <ShieldCheck className="w-5 h-5 text-emerald-500 shrink-0" />
                </div>
                <p className="text-2xl font-bold text-primary">{loan.interestRate}%
                  <span className="text-xs font-normal text-muted-foreground ml-1">p.a.</span>
                </p>
              </CardHeader>
              <CardContent className="space-y-2 text-xs text-muted-foreground">
                <div className="flex justify-between"><span>Max Amount</span><span className="font-medium text-foreground">₹{loan.maxAmount.toLocaleString()}</span></div>
                <div className="flex justify-between"><span>Tenure up to</span><span className="font-medium text-foreground">{loan.maxTenureMonths} months</span></div>
                <div className="flex justify-between"><span>Min EMI</span><span className="font-medium text-foreground">₹{loan.minEmi}</span></div>
                <div className="pt-1">
                  <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 border-none text-xs w-full justify-center">Active Partner</Badge>
                </div>
              </CardContent>
            </Card>
          ))}
          {!loans?.length && (
            <div className="col-span-full text-center py-12 text-muted-foreground">No loan partners configured.</div>
          )}
        </div>
      </div>
    </div>
  );
}
