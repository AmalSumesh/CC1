import express from 'express';
import { sensorUpdate } from '../controllers/sensor.controller.js';

const router = express.Router();
router.post('/update', sensorUpdate);
export default router;