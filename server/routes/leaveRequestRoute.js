const express = require('express');
const { applyLeave, approveLeave, rejectLeave } = require('../controllers/leaveRequestController');
const { verifyToken, authorizeRoles } = require('../middleware/authMiddleware');

const router = express.Router();

// Student applies for leave (Only Students)
router.post('/apply', verifyToken, authorizeRoles('student'), applyLeave);

// Warden approves leave (Only Wardens)
router.put('/approve/:id', verifyToken, authorizeRoles('warden'), approveLeave);

// Warden rejects leave (Only Wardens)
router.put('/reject/:id', verifyToken, authorizeRoles('warden'), rejectLeave);

module.exports = router;
