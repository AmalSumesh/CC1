import express from 'express';
import {
	getDrivers,
	addDriver,
	deleteDriver,
	assignBinToDriver,
	removeBinFromDriver,
	getDustbins,
	addDustbin,
	deleteDustbin
} from '../controllers/admin.controller.js';

const router = express.Router();

router.get('/drivers', getDrivers);
router.post('/driver', addDriver);
router.delete('/driver/:id', deleteDriver);

router.post('/assign-bin', assignBinToDriver);
router.post('/remove-bin', removeBinFromDriver);

router.get('/dustbins', getDustbins);
router.post('/dustbin', addDustbin);
router.delete('/dustbin/:id', deleteDustbin);

export default router;