const mongoose = require('mongoose');

const wardenSchema = new mongoose.Schema({
  wardenId: { type: String, required: true, unique: true },
  hostelBlock: { type: String, required: true }, 
  password: { type: String, required: true }, 
  role: { type: String, default: 'warden' } 
});

module.exports = mongoose.model('Warden', wardenSchema);
