import mongoose from 'mongoose';

const driverSchema = new mongoose.Schema({
  name: String,
  username: String,
  password: String,
  assignedBins: [{ 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Dustbin' 
  }]
});

export default mongoose.model('Driver', driverSchema);