import Dustbin from "../models/Dustbin.js";
import Complaint from "../models/Complaint.js";
import cloudinary from "../config/cloudinary.js";

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

    // 3. Upload images (if any)
    const imageUrls = [];

    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const result = await cloudinary.uploader.upload(file.path, {
          folder: "complaints",
        });
        imageUrls.push(result.secure_url);
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
