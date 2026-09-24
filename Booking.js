const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    slotId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ParkingSlot',
        required: true
    },
    vehicleNumber: {
        type: String,
        required: true
    },
    vehicleType: {
        type: String,
        required: true,
        enum: ['two-wheeler', 'four-wheeler', 'heavy-vehicle']
    },
    bookingDate: {
        type: Date,
        default: Date.now
    },
    startTime: {
        type: Date,
        required: true
    },
    endTime: {
        type: Date
    },
    totalAmount: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        required: true,
        enum: ['active', 'completed', 'cancelled'],
        default: 'active'
    }
}, { timestamps: true });

const BookingModel = mongoose.model('Booking', BookingSchema);
module.exports = BookingModel;