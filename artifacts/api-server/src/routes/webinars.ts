import { Router } from "express";
import { counters, sessions, users, webinars } from "../store/index";
import type { Webinar } from "../types";

const router = Router();

const MEMBERSHIP_DISCOUNTS: Record<string, number> = {
  basic: 20,
  gold: 40,
  platinum: 50,
  femmeelite: 60,
};

function getUserFromReq(req: any) {
  const token = (req.headers.authorization ?? "").replace("Bearer ", "");
  const userId = sessions.get(token);
  return userId ? users.find((u) => u.id === userId) : undefined;
}

// GET /api/webinars/upcoming
router.get("/upcoming", (req, res) => {
  const user = getUserFromReq(req);
  const discount = user ? (MEMBERSHIP_DISCOUNTS[user.membershipPlan] ?? 0) : 0;

  const now = new Date();
  const upcoming = webinars
    .filter((w) => new Date(w.date) > now)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map((w) => ({
      ...w,
      discountedPrice: Math.round(w.price * (1 - discount / 100)),
      discountPercent: discount,
    }));
  res.json(upcoming);
});

// GET /api/webinars
router.get("/", (req, res) => {
  const { status } = req.query as { status?: string };
  const now = new Date();
  let result = [...webinars];
  if (status === "upcoming") result = result.filter((w) => new Date(w.date) > now);
  if (status === "past") result = result.filter((w) => new Date(w.date) <= now);
  result.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  res.json(result);
});

// POST /api/webinars
router.post("/", (req, res) => {
  const { title, description, type, speaker, date, duration, price, maxCapacity, location } = req.body;
  const newWebinar: Webinar = {
    id: ++counters.webinar,
    title,
    description,
    type,
    speaker,
    date,
    duration: Number(duration),
    price: Number(price),
    registeredCount: 0,
    maxCapacity: Number(maxCapacity),
    isRegistered: false,
    imageUrl: null,
    meetingUrl: null,
    location: location ?? null,
    createdAt: new Date().toISOString(),
  };
  webinars.push(newWebinar);
  res.status(201).json(newWebinar);
});

// POST /api/webinars/:id/register
router.post("/:id/register", (req, res) => {
  const webinar = webinars.find((w) => w.id === Number(req.params.id));
  if (!webinar) { res.status(404).json({ error: "Webinar not found" }); return; }
  if (webinar.isRegistered) { res.json({ message: "Already registered" }); return; }
  webinar.isRegistered = true;
  webinar.registeredCount++;
  res.json({ message: "Successfully registered for the event" });
});

export default router;
