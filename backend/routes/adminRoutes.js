import express from 'express';
import { addDriver, assignBinToDriver } from '../controllers/admin.controller.js';

const router = express.Router();
router.post('/driver', addDriver);
router.post('/assign-bin', assignBinToDriver);
export default router;