import { Router } from "express";
import { appointments, notifications, reports, sessions, users, webinars } from "../store/index.js";

const router = Router();

const MEMBERSHIP_DISCOUNTS: Record<string, number> = {
  basic: 20,
  gold: 40,
  platinum: 50,
  femmeelite: 60,
};

const JOURNEY_STAGES = [
  "Awareness",
  "Consultation Pending",
  "Reports Submitted",
  "Doctor Assigned",
  "Treatment Planning",
  "Egg Freezing",
  "Complete",
];

function safeUser(u: (typeof users)[0]) {
  const { password: _, ...rest } = u;
  return rest;
}

function getUserFromReq(req: any) {
  const token = (req.headers.authorization ?? "").replace("Bearer ", "");
  const userId = sessions.get(token);
  return userId ? users.find((u) => u.id === userId) : undefined;
}

// GET /api/dashboard/summary
router.get("/summary", (req, res) => {
  const user = getUserFromReq(req);
  if (!user) { res.status(401).json({ error: "Unauthorized" }); return; }

  const stageIndex = JOURNEY_STAGES.indexOf(user.journeyStage);
  const journeyProgress = stageIndex >= 0
    ? Math.round((stageIndex / (JOURNEY_STAGES.length - 1)) * 100)
    : 0;

  const discount = MEMBERSHIP_DISCOUNTS[user.membershipPlan] ?? 0;
  const now = new Date();

  const upcomingAppts = appointments
    .filter((a) => a.userId === user.id && (a.status === "approved" || a.status === "pending"))
    .sort((a, b) => new Date(a.preferredDate).getTime() - new Date(b.preferredDate).getTime())
    .slice(0, 3);

  const recentReports = reports
    .filter((r) => r.userId === user.id)
    .sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime())
    .slice(0, 3);

  const upcomingWebinars = webinars
    .filter((w) => new Date(w.date) > now)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 3)
    .map((w) => ({
      ...w,
      discountedPrice: Math.round(w.price * (1 - discount / 100)),
      discountPercent: discount,
    }));

  const userNotifications = notifications.filter((n) => n.userId === user.id);

  res.json({
    user: safeUser(user),
    journeyStage: user.journeyStage,
    journeyProgress,
    nextAction: user.nextAction ?? "Complete your profile to get personalized guidance.",
    upcomingAppointments: upcomingAppts,
    recentReports,
    upcomingWebinars,
    notifications: userNotifications,
    sipProgress: null,
  });
});

export default router;
