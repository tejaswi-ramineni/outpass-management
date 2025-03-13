const express = require('express');
const { adminSignup, adminLogin } = require('../controllers/authController');
const { verifyToken, authorizeRoles } = require('../middleware/authMiddleware');
const { getAllStudents, manageStudent } = require('../controllers/adminController');

const router = express.Router();

// Authentication Routes
router.post('/signup', adminSignup);
router.post('/login', adminLogin);

// Protected Routes (Only Admins Can Access)
router.get('/students', verifyToken, authorizeRoles('admin'), getAllStudents);
router.put('/student/:id', verifyToken, authorizeRoles('admin'), manageStudent);

module.exports = router;
