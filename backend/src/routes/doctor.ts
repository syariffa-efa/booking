import express from "express";
import { getAllDoctors, getTopDoctors } from "../controllers/doctor";

const router = express.Router();

/* SEMUA DOKTER */
router.get("/all", getAllDoctors);

/* TOP 5 DOKTER */
router.get("/top", getTopDoctors);

export default router;