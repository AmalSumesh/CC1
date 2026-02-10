import Driver from '../models/Driver.js';
import Dustbin from '../models/Dustbin.js';

export const getDrivers = async (req, res) => {
  try {
    const drivers = await Driver.find().populate('assignedBins');
    res.json(drivers);
  } catch (error) {
    console.error('Error fetching drivers:', error);
    res.status(500).json({ message: 'Error fetching drivers' });
  }
};

export const addDriver = async (req, res) => {
  try {
    const { name, username, password } = req.body;
    if (!name || !username || !password) {
      return res.status(400).json({ message: 'Missing fields' });
    }

    const exists = await Driver.findOne({ username });
    if (exists) return res.status(409).json({ message: 'Username already exists' });

    const driver = await Driver.create({ name, username, password, assignedBins: [] });
    res.status(201).json(driver);
  } catch (error) {
    console.error('Error adding driver:', error);
    res.status(500).json({ message: 'Error adding driver' });
  }
};

export const deleteDriver = async (req, res) => {
  try {
    const { id } = req.params;
    await Driver.findByIdAndDelete(id);
    res.json({ message: 'Driver deleted' });
  } catch (error) {
    console.error('Error deleting driver:', error);
    res.status(500).json({ message: 'Error deleting driver' });
  }
};

export const assignBinToDriver = async (req, res) => {
  try {
    const { driverId, binId } = req.body;
    if (!driverId || !binId) return res.status(400).json({ message: 'Missing driverId or binId' });

    const driver = await Driver.findById(driverId);
    const bin = await Dustbin.findById(binId);
    if (!driver || !bin) return res.status(404).json({ message: 'Driver or Dustbin not found' });

    // avoid duplicates
    if (!driver.assignedBins.some(b => b.toString() === binId)) {
      driver.assignedBins.push(bin._id);
      await driver.save();
    }

    const updated = await Driver.findById(driverId).populate('assignedBins');
    res.json(updated);
  } catch (error) {
    console.error('Error assigning bin:', error);
    res.status(500).json({ message: 'Error assigning bin' });
  }
};

export const removeBinFromDriver = async (req, res) => {
  try {
    const { driverId, binId } = req.body;
    if (!driverId || !binId) return res.status(400).json({ message: 'Missing driverId or binId' });

    const driver = await Driver.findById(driverId);
    if (!driver) return res.status(404).json({ message: 'Driver not found' });

    driver.assignedBins = driver.assignedBins.filter(b => b.toString() !== binId);
    await driver.save();

    const updated = await Driver.findById(driverId).populate('assignedBins');
    res.json(updated);
  } catch (error) {
    console.error('Error removing bin:', error);
    res.status(500).json({ message: 'Error removing bin' });
  }
};

export const getDustbins = async (req, res) => {
  try {
    const bins = await Dustbin.find();
    res.json(bins);
  } catch (error) {
    console.error('Error fetching dustbins:', error);
    res.status(500).json({ message: 'Error fetching dustbins' });
  }
};

export const addDustbin = async (req, res) => {
  try {
    const { binCode, lat, lng, fillLevel = 0, priority = 1 } = req.body;
    if (!binCode || lat === undefined || lng === undefined) return res.status(400).json({ message: 'Missing fields' });

    const exists = await Dustbin.findOne({ binCode });
    if (exists) return res.status(409).json({ message: 'Bin code already exists' });

    const bin = await Dustbin.create({ binCode, location: { lat, lng }, fillLevel, priority });
    res.status(201).json(bin);
  } catch (error) {
    console.error('Error adding dustbin:', error);
    res.status(500).json({ message: 'Error adding dustbin' });
  }
};

export const deleteDustbin = async (req, res) => {
  try {
    const { id } = req.params;
    await Dustbin.findByIdAndDelete(id);
    // Also remove from any driver assignedBins
    await Driver.updateMany({}, { $pull: { assignedBins: id } });
    res.json({ message: 'Dustbin deleted' });
  } catch (error) {
    console.error('Error deleting dustbin:', error);
    res.status(500).json({ message: 'Error deleting dustbin' });
  }
};
