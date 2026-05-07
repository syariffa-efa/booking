import express from 'express';
import { getBookingByCode } from "../controllers/antrian";
const router = express.Router();

router.get("/:kode", getBookingByCode);


export default router;