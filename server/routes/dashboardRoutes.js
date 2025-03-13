const express = require('express');
const { verifyToken, authorizeRoles } = require('../middleware/authMiddleware');
const { getAdminDashboard, getStudentDashboard } = require('../controllers/dashboardController');


const router = express.Router();

// Admin Dashboard Route
router.get('/admin', verifyToken, authorizeRoles('admin'), (req, res) => {
    res.send('Welcome to Admin Dashboard');
});

// Student Dashboard Route
router.get('/student', verifyToken, authorizeRoles('student'), (req, res) => {
    res.send('Welcome to Student Dashboard');
});

module.exports = router;

