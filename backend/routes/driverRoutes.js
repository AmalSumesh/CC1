import express from 'express';
import { createOptimizedRoute } from '../controllers/driverController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/create-route', protect, createOptimizedRoute);

export default router;