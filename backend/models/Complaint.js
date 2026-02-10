import mongoose from "mongoose";

const complaintSchema = new mongoose.Schema(
  {
    binCode: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    images: [
      {
        type: String,
      },
    ],

    status: {
      type: String,
      enum: ["pending", "in_progress", "resolved"],
      default: "pending",
    },
  },
  { timestamps: true },
);

export default mongoose.model("Complaint", complaintSchema);
