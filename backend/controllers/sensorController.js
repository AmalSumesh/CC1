import { updateBinFromSensor } from '../services/sensor.service.js';

const sensorUpdate = async (req, res) => {
  try{
    const { binId, fillLevel } = req.body;

    if (!binId || fillLevel === undefined) {
      return res.status(400).json({
        message: 'binId and fillLevel are required'
      });
    }

    const updatedBin = await updateBinFromSensor(binId, fillLevel);

    if (!updatedBin) {
      return res.status(404).json({
        message: 'Dustbin not found'
      });
    }

    res.json({
      message: 'Sensor data updated successfully',
      bin: updatedBin
    });

  } 
  catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Sensor update failed'
    });
  }
};

export default { sensorUpdate };