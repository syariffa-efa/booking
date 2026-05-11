import express from 'express';
import cors from 'cors';
import cookieParser from "cookie-parser";

import authRoutes from './routes/auth';
import doctorRoutes from './routes/doctor';
import bookingRoutes from './routes/booking';
import antrianRoutes from './routes/antrian';
import scheduleRoutes from './routes/schedule';
import insuranceRoute from "./routes/insurance";
import registrationsRoutes from "./routes/riwayat";
import { authMiddleware } from "./shared/middleware/auth.middleware";

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true, 
  })
);

app.use(express.json());
app.use(cookieParser());

app.use("/api/antrian", antrianRoutes);
app.use("/api/insurance", insuranceRoute);
app.use("/api/doctors", doctorRoutes);
app.use('/auth', authRoutes);
app.use('/api/booking', bookingRoutes);
app.use("/api/schedule", scheduleRoutes);
app.use("/public", express.static("public"));
app.use("/registrations", authMiddleware, registrationsRoutes);

app.listen(5000, '0.0.0.0', () => {
  console.log('Server running on port 5000');
});