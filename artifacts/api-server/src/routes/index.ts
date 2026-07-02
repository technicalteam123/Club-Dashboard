import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import dashboardRouter from "./dashboard";
import appointmentsRouter from "./appointments";
import doctorsRouter, { listDoctorPatients, getDoctorDashboard } from "./doctors";
import reportsRouter from "./reports";
import communityRouter from "./community";
import messagesRouter from "./messages";
import webinarsRouter from "./webinars";
import financeRouter from "./finance";
import adminRouter, { createSupportTicket } from "./admin";

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
