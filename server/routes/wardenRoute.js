const express = require('express');
const { wardenSignup, wardenLogin } = require('../controllers/authController');
const { verifyToken, authorizeRoles } = require('../middleware/authMiddleware');
const { getLeaveRequests, getSingleLeaveRequest, approveLeave, rejectLeave, getStudentDetails } = require('../controllers/wardenController');

const router = express.Router();

// ✅ Authentication Routes
router.post('/signup', wardenSignup);
router.post('/login', wardenLogin);

// ✅ Protected Routes (Only Wardens Can Access)
router.get('/leave-requests', verifyToken, authorizeRoles('warden'), getLeaveRequests); // Get all leave requests
router.get('/leave-request/:id', verifyToken, authorizeRoles('warden'), getSingleLeaveRequest); // Get details of a single request
router.put('/approve-leave/:id', verifyToken, authorizeRoles('warden'), approveLeave); // Approve leave
router.put('/reject-leave/:id', verifyToken, authorizeRoles('warden'), rejectLeave); // Reject leave
router.get('/student/:id', verifyToken, authorizeRoles('warden'), getStudentDetails); // View student details

module.exports = router;
