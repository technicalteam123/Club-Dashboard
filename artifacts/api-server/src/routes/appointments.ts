import { Router } from "express";
import { appointments, counters, doctors, sessions, users } from "../store/index.js";
import type { Appointment } from "../types.js";

const router = Router();

function getUserFromReq(req: any) {
  const token = (req.headers.authorization ?? "").replace("Bearer ", "");
  const userId = sessions.get(token);
  return userId ? users.find((u) => u.id === userId) : undefined;
}

// GET /api/appointments
router.get("/", (req, res) => {
  const user = getUserFromReq(req);
  const { status, role } = req.query as { status?: string; role?: string };

  let result = [...appointments];

  if (user?.role === "user") {
    result = result.filter((a) => a.userId === user.id);
  } else if (user?.role === "doctor") {
    const doctorRecord = doctors.find((d) => d.name === user.name);
    if (doctorRecord) result = result.filter((a) => a.doctorId === doctorRecord.id);
  }
  // admin sees all

  if (status) result = result.filter((a) => a.status === status);

  result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  res.json(result);
});

// POST /api/appointments
router.post("/", (req, res) => {
  const user = getUserFromReq(req);
  if (!user) { res.status(401).json({ error: "Unauthorized" }); return; }

  const { doctorId, city, area, language, mode, preferredDate, notes } = req.body;
  const doctor = doctors.find((d) => d.id === Number(doctorId));
  if (!doctor) { res.status(404).json({ error: "Doctor not found" }); return; }

  const newAppt: Appointment = {
    id: ++counters.appointment,
    userId: user.id,
    userName: user.name,
    doctorId: doctor.id,
    doctorName: doctor.name,
    status: "pending",
    city,
    area,
    language,
    mode,
    preferredDate,
    confirmedDate: null,
    notes: notes ?? null,
    doctorNotes: null,
    createdAt: new Date().toISOString(),
  };
  appointments.push(newAppt);
  res.status(201).json(newAppt);
});

// GET /api/appointments/:id
router.get("/:id", (req, res) => {
  const appt = appointments.find((a) => a.id === Number(req.params.id));
  if (!appt) { res.status(404).json({ error: "Appointment not found" }); return; }
  res.json(appt);
});

// PATCH /api/appointments/:id/status
router.patch("/:id/status", (req, res) => {
  const appt = appointments.find((a) => a.id === Number(req.params.id));
  if (!appt) { res.status(404).json({ error: "Appointment not found" }); return; }

  const { status, doctorNotes, confirmedDate } = req.body;
  appt.status = status;
  if (doctorNotes !== undefined) appt.doctorNotes = doctorNotes;
  if (confirmedDate !== undefined) appt.confirmedDate = confirmedDate;
  res.json(appt);
});

export default router;
