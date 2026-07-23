import { Router } from "express";
import { appointments, counters, doctors, reports, sessions, users } from "../store/index.js";
import type { Doctor, PatientSummary } from "../types.js";

const router = Router();

function getUserFromReq(req: any) {
  const token = (req.headers.authorization ?? "").replace("Bearer ", "");
  const userId = sessions.get(token);
  return userId ? users.find((u) => u.id === userId) : undefined;
}

// GET /api/doctors/recommended
router.get("/recommended", (req, res) => {
  const { city, language } = req.query as { city?: string; language?: string };
  let result = [...doctors];
  if (city) result = result.filter((d) => d.city.toLowerCase().includes(city.toLowerCase()));
  if (language) result = result.filter((d) => d.languages.some((l) => l.toLowerCase().includes(language.toLowerCase())));
  result.sort((a, b) => b.rating - a.rating);
  res.json(result);
});

// GET /api/doctors
router.get("/", (_req, res) => {
  res.json([...doctors].sort((a, b) => b.rating - a.rating));
});

// POST /api/doctors
router.post("/", (req, res) => {
  const { name, specialty, city, area, languages, consultationModes, experienceYears, bio } = req.body;
  const newDoctor: Doctor = {
    id: ++counters.doctor,
    name,
    specialty,
    city,
    area,
    languages: languages ?? [],
    consultationModes: consultationModes ?? [],
    rating: 4.5,
    experienceYears: Number(experienceYears),
    avatarUrl: null,
    bio: bio ?? null,
    availableSlots: 5,
  };
  doctors.push(newDoctor);
  res.status(201).json(newDoctor);
});

// GET /api/doctors/:id
router.get("/:id", (req, res) => {
  const doctor = doctors.find((d) => d.id === Number(req.params.id));
  if (!doctor) { res.status(404).json({ error: "Doctor not found" }); return; }
  res.json(doctor);
});

// GET /api/doctor/patients (doctor-specific)
export const listDoctorPatients = (req: any, res: any) => {
  const user = getUserFromReq(req);
  if (!user) { res.status(401).json({ error: "Unauthorized" }); return; }

  const doctorRecord = doctors.find((d) => d.name === user.name);
  if (!doctorRecord) {
    // Return all patients for demo
    const allPatients: PatientSummary[] = users
      .filter((u) => u.role === "user")
      .map((u) => {
        const lastAppt = appointments
          .filter((a) => a.userId === u.id)
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];
        const userReports = reports.filter((r) => r.userId === u.id);
        return {
          id: u.id,
          name: u.name,
          email: u.email,
          membershipPlan: u.membershipPlan,
          journeyStage: u.journeyStage,
          lastAppointmentDate: lastAppt?.confirmedDate ?? lastAppt?.preferredDate ?? null,
          reportsCount: userReports.length,
          avatarUrl: u.avatarUrl,
        };
      });
    res.json(allPatients);
    return;
  }

  const assignedUserIds = new Set(
    appointments.filter((a) => a.doctorId === doctorRecord.id).map((a) => a.userId)
  );
  const patients: PatientSummary[] = users
    .filter((u) => assignedUserIds.has(u.id))
    .map((u) => {
      const lastAppt = appointments
        .filter((a) => a.userId === u.id && a.doctorId === doctorRecord.id)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];
      const userReports = reports.filter((r) => r.userId === u.id);
      return {
        id: u.id,
        name: u.name,
        email: u.email,
        membershipPlan: u.membershipPlan,
        journeyStage: u.journeyStage,
        lastAppointmentDate: lastAppt?.confirmedDate ?? lastAppt?.preferredDate ?? null,
        reportsCount: userReports.length,
        avatarUrl: u.avatarUrl,
      };
    });
  res.json(patients);
};

// GET /api/doctor/dashboard
export const getDoctorDashboard = (req: any, res: any) => {
  const user = getUserFromReq(req);
  if (!user) { res.status(401).json({ error: "Unauthorized" }); return; }

  const doctorRecord = doctors.find((d) => d.name === user.name);
  const doctorId = doctorRecord?.id ?? 1;

  const allAssigned = appointments.filter((a) => a.doctorId === doctorId);
  const pending = allAssigned.filter((a) => a.status === "pending");
  const today = new Date().toISOString().split("T")[0];
  const todayAppts = allAssigned.filter(
    (a) => a.status === "approved" && (a.confirmedDate ?? a.preferredDate).startsWith(today)
  );
  const patientIds = new Set(allAssigned.map((a) => a.userId));
  const pendingReports = reports.filter((r) => patientIds.has(r.userId) && !r.doctorNotes);

  res.json({
    pendingAppointments: pending.length,
    todayAppointments: todayAppts.length,
    totalPatients: patientIds.size,
    recentAppointments: allAssigned
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5),
    pendingReportReviews: pendingReports.length,
  });
};

export default router;
