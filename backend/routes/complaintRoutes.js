import express from "express";
import {
  createComplaint,
  getComplaints,
} from "../controllers/complaint.controller.js";
import upload from "../middleware/multer.js";

const router = express.Router();

// POST /api/complaints
router.post("/", upload.array("images", 3), createComplaint);

// GET /api/complaints
router.get("/", getComplaints);

export default router;
