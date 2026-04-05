const mongoose = require('mongoose');

const actionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  actionText: String,
  category: { 
    type: String, 
    enum: ['productive', 'distraction', 'physical', 'emotional', 'social'], 
    default: 'productive' 
  },
  emotion: { 
    type: String, 
    enum: ['happy', 'sad', 'angry', 'neutral', 'stressed', 'excited'], 
    default: 'neutral' 
  },
  timestamp: { type: Date, default: Date.now },
  source: { type: String, enum: ['manual', 'auto_sensor', 'auto_message'], default: 'manual' },
  metadata: { type: Object, default: {} }
});

module.exports = mongoose.model('Action', actionSchema);