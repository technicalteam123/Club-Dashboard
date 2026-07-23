import { Router, type IRouter } from "express";
import healthRouter from "./health.js";
import authRouter from "./auth.js";
import dashboardRouter from "./dashboard.js";
import appointmentsRouter from "./appointments.js";
import doctorsRouter, { listDoctorPatients, getDoctorDashboard } from "./doctors.js";
import reportsRouter from "./reports.js";
import communityRouter from "./community.js";
import messagesRouter from "./messages.js";
import webinarsRouter from "./webinars.js";
import financeRouter from "./finance.js";
import adminRouter, { createSupportTicket } from "./admin.js";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/auth", authRouter);
router.use("/dashboard", dashboardRouter);
router.use("/appointments", appointmentsRouter);
router.use("/doctors", doctorsRouter);
router.get("/doctor/patients", listDoctorPatients);
router.get("/doctor/dashboard", getDoctorDashboard);
router.use("/reports", reportsRouter);
router.use("/community", communityRouter);
router.use("/messages", messagesRouter);
router.use("/webinars", webinarsRouter);
router.use("/finance", financeRouter);
router.use("/admin", adminRouter);
router.post("/support/tickets", createSupportTicket);

export default router;
