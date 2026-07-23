import { Router } from "express";
import { counters, reports, sessions, users } from "../store/index.js";
import type { Report } from "../types.js";

const router = Router();

function getUserFromReq(req: any) {
  const token = (req.headers.authorization ?? "").replace("Bearer ", "");
  const userId = sessions.get(token);
  return userId ? users.find((u) => u.id === userId) : undefined;
}

// GET /api/reports
router.get("/", (req, res) => {
  const user = getUserFromReq(req);
  const { patientId } = req.query as { patientId?: string };

  let result = [...reports];

  if (user?.role === "user") {
    result = result.filter((r) => r.userId === user.id);
  } else if (patientId) {
    result = result.filter((r) => r.userId === Number(patientId));
  }

  result.sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime());
  res.json(result);
});

// POST /api/reports
router.post("/", (req, res) => {
  const user = getUserFromReq(req);
  if (!user) { res.status(401).json({ error: "Unauthorized" }); return; }

  const { type, fileName, fileUrl, isLabBooked, labName, labDate } = req.body;
  const newReport: Report = {
    id: ++counters.report,
    userId: user.id,
    userName: user.name,
    type,
    fileName,
    fileUrl: fileUrl ?? `/uploads/${fileName}`,
    uploadedAt: new Date().toISOString(),
    doctorNotes: null,
    recommendations: null,
    isLabBooked: isLabBooked ?? false,
    labName: labName ?? null,
    labDate: labDate ?? null,
  };
  reports.push(newReport);
  res.status(201).json(newReport);
});

// GET /api/reports/:id
router.get("/:id", (req, res) => {
  const report = reports.find((r) => r.id === Number(req.params.id));
  if (!report) { res.status(404).json({ error: "Report not found" }); return; }
  res.json(report);
});

// PATCH /api/reports/:id/notes
router.patch("/:id/notes", (req, res) => {
  const report = reports.find((r) => r.id === Number(req.params.id));
  if (!report) { res.status(404).json({ error: "Report not found" }); return; }
  const { doctorNotes, recommendations } = req.body;
  report.doctorNotes = doctorNotes;
  if (recommendations !== undefined) report.recommendations = recommendations;
  res.json(report);
});

export default router;
