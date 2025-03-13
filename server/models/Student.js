const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  regId: { type: String, required: true, unique: true }, 
  hostelBlock: { type: String, required: true }, 
  password: { type: String, required: true },
  role: { type: String, default: 'student' } 
});

module.exports = mongoose.model('Student', studentSchema);
