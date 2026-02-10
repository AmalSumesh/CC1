import mongoose from 'mongoose';

const dustbinSchema = new mongoose.Schema({
  binCode: String,
  
  location: { 
    lat: Number, 
    lng: Number 
    },

  fillLevel: { 
    type: Number, 
    default: 0 
    },

  priority: { 
    type: Number, 
    default: 1  
    }
});

export default mongoose.model('Dustbin', dustbinSchema);