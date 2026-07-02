import { useGetSipPlan, useGetFinancialGuidance, useListLoanOffers, useApplyForLoan } from '@workspace/api-client-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { DollarSign, Landmark, TrendingUp, ShieldCheck } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

export default function UserFinance() {
  const { data: sip } = useGetSipPlan();
  const { data: guidance } = useGetFinancialGuidance();
  const { data: loans } = useListLoanOffers();
  const applyLoan = useApplyForLoan();

  const handleApply = (id: number, bankName: string) => {
    applyLoan.mutate({ id }, {
      onSuccess: () => toast.success(`Application sent to ${bankName}. A representative will contact you.`)
    });
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div>
        <h1 className="text-3xl font-display font-semibold mb-2">Finance & SIP</h1>
        <p className="text-muted-foreground text-lg">Plan and track your fertility journey funding.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* SIP Tracker */}
        <Card className="md:col-span-1 bg-gradient-to-b from-primary/10 to-transparent border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Egg Freezing SIP
            </CardTitle>
            <CardDescription>Track your monthly savings goal</CardDescription>
          </CardHeader>
          <CardContent>
            {sip ? (
              <div className="space-y-6 flex flex-col items-center">
                {/* Circular Progress approximation */}
                <div className="relative w-40 h-40 flex items-center justify-center rounded-full bg-white dark:bg-black/50 shadow-inner">
                  <svg className="absolute inset-0 w-full h-full -rotate-90">
                    <circle cx="80" cy="80" r="70" fill="none" stroke="currentColor" strokeWidth="12" className="text-muted/50" />
                    <circle cx="80" cy="80" r="70" fill="none" stroke="currentColor" strokeWidth="12" strokeDasharray={`${(sip.progressPercent / 100) * 440} 440`} className="text-primary transition-all duration-1000" strokeLinecap="round" />
                  </svg>
                  <div className="text-center">
                    <span className="text-3xl font-bold font-display">{sip.progressPercent}%</span>
                  </div>
                </div>
                
                <div className="w-full space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Saved</span>
                    <span className="font-semibold">₹{sip.currentSaved.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Goal</span>
                    <span className="font-semibold">₹{sip.goalAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Monthly Contribution</span>
                    <span className="font-semibold">₹{sip.monthlyContribution.toLocaleString()}</span>
                  </div>
                </div>
                <Button variant="outline" className="w-full">Manage SIP via {sip.bankName}</Button>
              </div>
            ) : (
              <div className="text-center py-8 space-y-4">
                <p className="text-muted-foreground text-sm">You haven't started an SIP yet.</p>
                <Button>Start SIP Plan</Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Financial Guidance */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-primary" />
              Estimated Cost Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            {guidance && (
              <div className="space-y-6">
                <div className="bg-primary/5 p-4 rounded-xl border border-primary/10">
                  <p className="text-sm font-medium text-primary">ESTIMATED TOTAL</p>
                  <p className="text-3xl font-display font-bold">₹{guidance.estimatedTotalCost.toLocaleString()}</p>
                </div>
                
                <div className="space-y-4">
                  {guidance.costBreakdown.map((item, idx) => (
                    <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors">
                      <div>
                        <p className="font-medium">{item.label}</p>
                        <p className="text-xs text-muted-foreground">{item.description}</p>
                      </div>
                      <p className="font-semibold mt-2 sm:mt-0 text-right">₹{item.amount.toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Loan Marketplace */}
      <div>
        <h2 className="text-2xl font-display font-semibold mb-6 flex items-center gap-2">
          <Landmark className="w-6 h-6 text-primary" />
          Partner Loan Offers
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {loans?.map(loan => (
            <Card key={loan.id} className="relative overflow-hidden group hover:border-primary transition-colors">
              <CardHeader className="pb-4">
                <div className="flex justify-between items-start mb-2">
                  <CardTitle>{loan.bankName}</CardTitle>
                  <ShieldCheck className="w-5 h-5 text-green-500" />
                </div>
                <div className="text-2xl font-bold text-primary">{loan.interestRate}% <span className="text-sm text-muted-foreground font-normal">p.a.</span></div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Max Amount</span>
                    <span className="font-medium">₹{loan.maxAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tenure up to</span>
                    <span className="font-medium">{loan.maxTenureMonths} mos</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Min EMI</span>
                    <span className="font-medium">₹{loan.minEmi}</span>
                  </div>
                </div>
                <Button className="w-full mt-4" onClick={() => handleApply(loan.id, loan.bankName)} disabled={applyLoan.isPending}>
                  Apply Now
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
