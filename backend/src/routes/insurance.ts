import express from "express";
import { checkBPJS } from "../controllers/insurance";

const router = express.Router();

router.post("/check-bpjs", checkBPJS);

export default router;