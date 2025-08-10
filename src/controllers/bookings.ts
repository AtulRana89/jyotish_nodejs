// controllers/bookingController.js
import Booking from "../models/bookings"

export const createBooking = async (req:any, res:any) => {
  try {
    const {
      astrologerId,
      serviceId,
      personalDetails,
      bookingDetails
    } = req.body;

    // Validate required fields
    if (!astrologerId || !serviceId) {
      return res.status(400).json({ message: "Astrologer ID and Service ID are required" });
    }

    if (!personalDetails?.fullName || !personalDetails?.email || !personalDetails?.phoneNumber) {
      return res.status(400).json({ message: "Personal details are incomplete" });
    }

    if (!bookingDetails?.date || !bookingDetails?.time) {
      return res.status(400).json({ message: "Booking date and time are required" });
    }

    // Create booking
    const booking = new Booking({
      astrologerId,
      serviceId,
      personalDetails,
      bookingDetails
    });

    await booking.save();

    return res.status(201).json({
      message: "Booking created successfully",
      data: booking
    });
  } catch (error) {
    console.error("Error creating booking:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
