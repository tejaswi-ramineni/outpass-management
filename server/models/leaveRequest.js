const mongoose = require('mongoose');

const leaveRequestSchema = new mongoose.Schema({
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        required: true,
        index: true // Improves performance for queries
    },
    fromDate: {
        type: Date,
        required: true,
        validate: {
            validator: function (value) {
                return value >= new Date(); // Ensures leave date is not in the past
            },
            message: 'Leave start date cannot be in the past'
        }
    },
    toDate: {
        type: Date,
        required: true,
        validate: {
            validator: function (value) {
                return this.fromDate <= value; // Ensures 'toDate' is after 'fromDate'
            },
            message: 'End date must be after start date'
        }
    },
    reason: {
        type: String,
        required: true,
        trim: true,
        maxlength: 200 // Limits reason to 200 characters
    },
    status: {
        type: String,
        enum: ['Pending', 'Approved', 'Rejected'],
        default: 'Pending'
    }
}, { timestamps: true });

module.exports = mongoose.model('LeaveRequest', leaveRequestSchema);
