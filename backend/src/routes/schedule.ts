import express from "express";
import { getAllSchedule, getScheduleByDoctor } from "../controllers/schedule";
import { authMiddleware } from "../shared/middleware/auth.middleware";
import { getScheduleById } from "../controllers/schedule";

const router = express.Router();

router.get("/", getAllSchedule);
router.get("/doctor/:doctorId", getScheduleByDoctor);
router.get("/:id", getScheduleById);
export default router;