const LeaveRequest = require('../models/leaveRequest');

//  Apply for Leave (Student)
exports.applyLeave = async (req, res) => {
    const { fromDate, toDate, reason } = req.body;

    // Ensure user is authenticated
    if (!req.user || req.user.role !== 'student') {
        return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    try {
        // Check if required fields are present
        if (!fromDate || !toDate || !reason) {
            return res.status(400).json({ success: false, message: 'All fields are required' });
        }

        // Prevent duplicate leave requests
        const existingRequest = await LeaveRequest.findOne({
            studentId: req.user.id,
            status: 'Pending'
        });

        if (existingRequest) {
            return res.status(400).json({ success: false, message: 'You already have a pending leave request' });
        }

        // Create the leave request
        const leaveRequest = await LeaveRequest.create({
            studentId: req.user.id,
            fromDate,
            toDate,
            reason,
            status: 'Pending'
        });

        res.status(201).json({ success: true, message: 'Leave request submitted', leaveRequest });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

// ✅ Approve Leave (Warden)
exports.approveLeave = async (req, res) => {
    const { id } = req.params;

    try {
        const leaveRequest = await LeaveRequest.findById(id);

        if (!leaveRequest) {
            return res.status(404).json({ success: false, message: 'Leave request not found' });
        }

        if (leaveRequest.status !== 'Pending') {
            return res.status(400).json({ success: false, message: 'Leave request already processed' });
        }

        leaveRequest.status = 'Approved';
        await leaveRequest.save();

        res.status(200).json({ success: true, message: 'Leave approved', leaveRequest });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

// ✅ Reject Leave (Warden)
exports.rejectLeave = async (req, res) => {
    const { id } = req.params;

    try {
        const leaveRequest = await LeaveRequest.findById(id);

        if (!leaveRequest) {
            return res.status(404).json({ success: false, message: 'Leave request not found' });
        }

        if (leaveRequest.status !== 'Pending') {
            return res.status(400).json({ success: false, message: 'Leave request already processed' });
        }

        leaveRequest.status = 'Rejected';
        await leaveRequest.save();

        res.status(200).json({ success: true, message: 'Leave rejected', leaveRequest });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};
