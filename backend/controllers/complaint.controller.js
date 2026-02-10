import Dustbin from "../models/Dustbin.js";
import Complaint from "../models/Complaint.js";
import cloudinary from "../config/cloudinary.js";
import fs from "fs";
import axios from "axios";
import FormData from "form-data";

export const createComplaint = async (req, res) => {
  try {
    const { binCode, description } = req.body;

    if (!binCode || !description) {
      return res
        .status(400)
        .json({ message: "binCode and description required" });
    }

    const dustbin = await Dustbin.findOne({ binCode });
    if (!dustbin) {
      return res.status(400).json({ message: "Invalid bin code" });
    }

    // AI Validation Step
    if (req.files && req.files.length > 0) {
      let isValidComplaint = false;
      const aiServiceUrl = process.env.AI_SERVICE_URL || "http://localhost:8000";

      for (const file of req.files) {
        try {
          const formData = new FormData();
          formData.append("image", fs.createReadStream(file.path));

          console.log(`Sending image ${file.filename} to AI service at ${aiServiceUrl}/predict...`);

          const response = await axios.post(`${aiServiceUrl}/predict`, formData, {
            headers: {
              ...formData.getHeaders(),
            },
          });

          const { detections } = response.data;
          console.log("AI Response:", response.data);

          // Check if any detection explicitly indicates garbage/overflow with sufficient confidence
          // Assuming the model is trained to detect garbage/overflow
          // We'll consider it valid if at least one detection has confidence > 0.5
          if (detections && detections.some(d => d.confidence > 0.5)) {
            isValidComplaint = true;
          }
        } catch (aiError) {
          console.error("AI Service Error:", aiError.message);
          // If AI service fails, we might want to default to allowing or blocking.
          // For now, let's log it and maybe assume valid if service is down?
          // But strict requirement says "ensure that only valid complaint... reaches admin portal".
          // So if AI fails, we should probably fail safe (reject) or soft fail (accept).
          // Given "confidence score based", let's be strict but handle connection errors gracefully.
          // If service is down, maybe we can't validate. Let's assume invalid to be safe or valid to be robust?
          // "ensure only valid... reaches". Implies strictness.
          // But let's not block if service is just offline? 
          // I will treat error as invalid for now to enforce the rule.
        }
      }

      if (!isValidComplaint) {
        // Cleanup uploaded files
        for (const file of req.files) {
          fs.unlinkSync(file.path);
        }
        return res.status(400).json({
          message: "Complaint rejected: No garbage detected in images or confidence too low."
        });
      }
    } else {
      // If no images, straightforward processing (or should we require images?)
      // The prompt says "accepts complaint with images". implies images are expected.
      // If no images, maybe auto-accept or reject?
      // "ensure that only valid complaint ... reaches".
      // Let's assume text-only is allowed if images are optional, but if images are provided, they must be valid.
    }

    // 3. Upload images (if any)
    const imageUrls = [];

    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const result = await cloudinary.uploader.upload(file.path, {
          folder: "complaints",
        });
        imageUrls.push(result.secure_url);
        // Clean up local file after upload
        try {
          if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
        } catch (e) { console.error("Error deleting file", e); }
      }
    }

    // 4. Save complaint
    const complaint = await Complaint.create({
      binCode: dustbin.binCode,
      description,
      images: imageUrls,
    });

    // 5. Success response
    res.status(201).json({
      message: "Complaint submitted successfully",
      complaint,
    });
  } catch (error) {
    console.error(error);
    // Cleanup files if error
    if (req.files) {
      req.files.forEach(file => {
        if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
      });
    }
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * GET /complaints
 * Query params (optional):
 * - binCode
 * - status
 */
export const getComplaints = async (req, res) => {
  try {
    const { binCode, status } = req.query;

    const filter = {};

    if (binCode) filter.binCode = binCode;
    if (status) filter.status = status;

    const complaints = await Complaint.find(filter).sort({ createdAt: -1 });

    res.status(200).json({
      count: complaints.length,
      complaints,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateComplaintStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ message: "Status is required" });
    }

    const complaint = await Complaint.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    res.json({ message: "Complaint status updated", complaint });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
