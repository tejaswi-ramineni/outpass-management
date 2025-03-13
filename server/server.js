// mongoose.connect(process.env.MONGO_URI)
//     .then(() => console.log('Connected to MongoDB'))
//     .catch(err => console.error(err));

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/db');

// Import Routes
const studentRoutes = require('./routes/studentRoute');
const wardenRoutes = require('./routes/wardenRoute');
const adminRoutes = require('./routes/adminRoute');
const leaveRequestRoutes = require('./routes/leaveRequestRoute');

const app = express();
app.use(cors());
app.use(express.json());

// Connect to Database
connectDB();

// ===============================
// ✅ Define Routes
// ===============================
app.use('/api/student', studentRoutes);
app.use('/api/warden', wardenRoutes);
app.use('/api/admin', adminRoutes);
app.use('/dashboard', dashboardRoutes);

// ===============================
// ✅ Base Route
// ===============================
app.get('/', (req, res) => {
    res.send('🚀 Server is Running');
});

// ===============================
// ✅ Global Error Handler (Optional)
// ===============================
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});

// ===============================
// ✅ Listen to Port
// ===============================
const port = process.env.PORT || 5001;
app.listen(port, () => console.log(`🚀 Server is running on port ${port}`));
