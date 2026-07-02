import { Router } from "express";
import { appointments, counters, doctors, sessions, supportTickets, users, webinars } from "../store/index";
import type { SupportTicket } from "../types";

const router = Router();

function getUserFromReq(req: any) {
  const token = (req.headers.authorization ?? "").replace("Bearer ", "");
  const userId = sessions.get(token);
  return userId ? users.find((u) => u.id === userId) : undefined;
}

function safeUser(u: (typeof users)[0]) {
  const { password: _, ...rest } = u;
  return rest;
}

// GET /api/admin/analytics
router.get("/analytics", (_req, res) => {
  const membershipMap: Record<string, number> = {};
  users.filter((u) => u.role === "user").forEach((u) => {
    membershipMap[u.membershipPlan] = (membershipMap[u.membershipPlan] ?? 0) + 1;
  });

  const appointmentsByMonth: Record<string, number> = {};
  appointments.forEach((a) => {
    const month = a.createdAt.slice(0, 7);
    appointmentsByMonth[month] = (appointmentsByMonth[month] ?? 0) + 1;
  });

  const months = Object.entries(appointmentsByMonth)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, count]) => ({ month, count }));

  // Pad with mock historical data
  const historicalData = [
    { month: "2025-01", count: 8 },
    { month: "2025-02", count: 14 },
    { month: "2025-03", count: 22 },
    { month: "2025-04", count: 31 },
    { month: "2025-05", count: 38 },
    { month: "2025-06", count: 45 },
    ...months,
  ];

  const openTickets = supportTickets.filter((t) => t.status !== "resolved").length;

  res.json({
    totalUsers: users.filter((u) => u.role === "user").length,
    totalDoctors: doctors.length,
    totalAppointments: appointments.length,
    pendingAppointments: appointments.filter((a) => a.status === "pending").length,
    totalRevenue: 1847500,
    membershipBreakdown: Object.entries(membershipMap).map(([plan, count]) => ({ plan, count })),
    appointmentsByMonth: historicalData,
    openTickets,
  });
});

// GET /api/admin/users
router.get("/users", (_req, res) => {
  res.json(users.map(safeUser));
});

// PATCH /api/admin/users/:id/membership
router.patch("/users/:id/membership", (req, res) => {
  const user = users.find((u) => u.id === Number(req.params.id));
  if (!user) { res.status(404).json({ error: "User not found" }); return; }
  const { membershipPlan } = req.body;
  user.membershipPlan = membershipPlan;
  res.json(safeUser(user));
});

// GET /api/admin/support-tickets
router.get("/support-tickets", (_req, res) => {
  res.json([...supportTickets].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
});

// POST /api/support/tickets
export const createSupportTicket = (req: any, res: any) => {
  const user = getUserFromReq(req);
  if (!user) { res.status(401).json({ error: "Unauthorized" }); return; }

  const { subject, message } = req.body;
  const ticket: SupportTicket = {
    id: ++counters.ticket,
    userId: user.id,
    userName: user.name,
    subject,
    message,
    status: "open",
    createdAt: new Date().toISOString(),
  };
  supportTickets.push(ticket);
  res.status(201).json(ticket);
};

export default router;
