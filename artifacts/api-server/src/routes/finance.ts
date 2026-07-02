import { Router } from "express";
import { loanOffers, sessions, sipPlans, users } from "../store/index";
import type { SipPlan } from "../types";

const router = Router();

function getUserFromReq(req: any) {
  const token = (req.headers.authorization ?? "").replace("Bearer ", "");
  const userId = sessions.get(token);
  return userId ? users.find((u) => u.id === userId) : undefined;
}

function calcEstimatedDate(monthly: number, goal: number, saved: number): string {
  const remaining = goal - saved;
  if (remaining <= 0) return new Date().toISOString();
  const months = Math.ceil(remaining / monthly);
  const date = new Date();
  date.setMonth(date.getMonth() + months);
  return date.toISOString();
}

// GET /api/finance/sip
router.get("/sip", (req, res) => {
  const user = getUserFromReq(req);
  if (!user) { res.status(401).json({ error: "Unauthorized" }); return; }

  const plan = sipPlans.find((s) => s.userId === user.id);
  if (!plan) {
    // Return empty placeholder for users without a plan
    res.json({
      id: 0,
      userId: user.id,
      monthlyContribution: 0,
      goalAmount: 400000,
      currentSaved: 0,
      progressPercent: 0,
      estimatedCompletionDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000 * 24).toISOString(),
      startDate: new Date().toISOString(),
      bankName: null,
    });
    return;
  }
  res.json(plan);
});

// POST /api/finance/sip
router.post("/sip", (req, res) => {
  const user = getUserFromReq(req);
  if (!user) { res.status(401).json({ error: "Unauthorized" }); return; }

  const { monthlyContribution, goalAmount, bankName } = req.body;
  let plan = sipPlans.find((s) => s.userId === user.id);

  if (plan) {
    plan.monthlyContribution = Number(monthlyContribution);
    plan.goalAmount = Number(goalAmount);
    if (bankName !== undefined) plan.bankName = bankName;
    plan.progressPercent = Math.round((plan.currentSaved / plan.goalAmount) * 100);
    plan.estimatedCompletionDate = calcEstimatedDate(plan.monthlyContribution, plan.goalAmount, plan.currentSaved);
  } else {
    const newPlan: SipPlan = {
      id: sipPlans.length + 1,
      userId: user.id,
      monthlyContribution: Number(monthlyContribution),
      goalAmount: Number(goalAmount),
      currentSaved: 0,
      progressPercent: 0,
      estimatedCompletionDate: calcEstimatedDate(Number(monthlyContribution), Number(goalAmount), 0),
      startDate: new Date().toISOString(),
      bankName: bankName ?? null,
    };
    sipPlans.push(newPlan);
    plan = newPlan;
  }
  res.json(plan);
});

// GET /api/finance/loans
router.get("/loans", (_req, res) => {
  res.json(loanOffers);
});

// POST /api/finance/loans/:id/apply
router.post("/loans/:id/apply", (req, res) => {
  const offer = loanOffers.find((l) => l.id === Number(req.params.id));
  if (!offer) { res.status(404).json({ error: "Loan offer not found" }); return; }
  res.json({ message: `Your application to ${offer.bankName} has been submitted. Our team will contact you within 2-3 business days.` });
});

// GET /api/finance/guidance
router.get("/guidance", (_req, res) => {
  res.json({
    costBreakdown: [
      { label: "Consultation Fees", amount: 5000, description: "Initial and follow-up consultations" },
      { label: "Stimulation Medications", amount: 80000, description: "FSH injections and supporting drugs" },
      { label: "Egg Retrieval Procedure", amount: 100000, description: "OPU procedure and anesthesia" },
      { label: "Lab & Embryology Fees", amount: 60000, description: "Egg vitrification and first year storage" },
      { label: "Annual Storage", amount: 15000, description: "Per year cryo-storage fee" },
      { label: "Monitoring Scans", amount: 20000, description: "Ultrasounds during stimulation" },
      { label: "Blood Tests", amount: 8000, description: "AMH, FSH, AFC and other hormonal panels" },
    ],
    savingsRecommendations: [
      "Start a dedicated SIP of ₹10,000–₹20,000/month for 18–24 months",
      "Check if your employer offers fertility benefits — growing number of Indian tech companies do",
      "Book blood tests at Metropolis via EFFF to get 15% discount",
      "Consider doing 2 retrieval cycles in the same stimulation window — costs ~40% less per cycle",
    ],
    fundingSuggestions: [
      "EFFF partner banks offer medical loans at 10.5%–13% with up to 60-month repayment",
      "Some company insurance policies cover fertility diagnostics — check your HR policy",
      "Tax deduction under Section 80D may apply for related medical expenses",
      "Apply for Bajaj Finance Flexi Hybrid Loan for flexibility without prepayment penalty",
    ],
    estimatedTotalCost: 288000,
  });
});

export default router;
