import express from "express";
import { getBookingHistory, cancelBooking } from "../controllers/riwayat";
import { authMiddleware } from "../shared/middleware/auth.middleware";

const router = express.Router();

router.get("/riwayat", authMiddleware, getBookingHistory);
router.put("/cancel/:id_registration", authMiddleware, cancelBooking);

export default router;