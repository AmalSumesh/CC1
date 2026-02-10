import express from "express";
import {
  createComplaint,
  getComplaints,
  updateComplaintStatus,
} from "../controllers/complaint.controller.js";
import upload from "../middleware/multer.js";

const router = express.Router();

// POST /api/complaints
router.post("/", upload.array("images", 3), createComplaint);

// GET /api/complaints
router.get("/", getComplaints);

// PATCH /api/complaints/:id
router.patch("/:id", updateComplaintStatus);

export default router;
