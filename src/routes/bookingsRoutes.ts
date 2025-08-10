// routes/booking.routes.js
import express from "express";
import { createBooking } from "../controllers/bookings";


const bookingRouter = express.Router();

bookingRouter.post("/bookings", createBooking);

export default bookingRouter;
