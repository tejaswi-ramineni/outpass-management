const Student = require('../models/Student');

// Fetch Student Profile
exports.getStudentProfile = async (req, res) => {
    try {
        // Find student by ID from JWT token
        const student = await Student.findById(req.user.id).select('-password');

        if (!student) {
            return res.status(404).json({ success: false, message: 'Student not found' });
        }

        res.status(200).json({ success: true, student });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};
