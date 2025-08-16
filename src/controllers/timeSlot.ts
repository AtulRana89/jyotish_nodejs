// src/controllers/timeSlot.ts
import { Request, Response } from "express";
import Astrologer from "../models/Astrologer";

export const getBookedTimeSlotsByDate = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const astrologerId = req.params.id;
    const { date } = req.query; // e.g. 2025-08-20

    if (!date) {
      res
        .status(400)
        .json({ success: false, message: "Date is required in query" });
      return;
    }

    const astrologer = await Astrologer.findById(astrologerId).lean();

    if (!astrologer) {
      res
        .status(404)
        .json({ success: false, message: "Astrologer not found" });
      return;
    }

    // Convert string date to Date object (strip time)
    const queryDate = new Date(date as string);

    const bookedSlots = astrologer.timeSlots.filter((slot) => {
      return (
        slot.date &&
        new Date(slot.date).toDateString() === queryDate.toDateString() &&
        slot.available === false // only booked slots
      );
    });

    res.status(200).json({
      success: true,
      astrologerId,
      date,
      bookedSlots,
    });
  } catch (error) {
    console.error("Error fetching booked slots:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
