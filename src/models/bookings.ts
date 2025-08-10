// models/booking.model.js
import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    astrologerId: { type: mongoose.Schema.Types.ObjectId, ref: "Astrologer", required: true },
    serviceId: { type: mongoose.Schema.Types.ObjectId, ref: "Service", required: true },

    personalDetails: {
      fullName: { type: String, required: true },
      email: { type: String, required: true },
      phoneNumber: { type: String, required: true },
      gender: { type: String, enum: ["Male", "Female", "Other"], required: true },
      dateOfBirth: { type: Date, required: true },
      placeOfBirth: { type: String, required: true }
    },

    bookingDetails: {
      date: { type: Date, required: true },
      time: { type: String, required: true }
    }
  },
  { timestamps: true }
);

export default mongoose.model("Booking", bookingSchema);
