const mongoose = require('mongoose');

const ParkingSlotSchema = new mongoose.Schema({
    areaId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ParkingArea',
        required: true
    },
    slotNumber: {
        type: String,
        required: true
    },
    slotType: {
        type: String,
        required: true,
        enum: ['two-wheeler', 'four-wheeler', 'heavy-vehicle'],
        default: 'two-wheeler'
    },
    floor: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: ['available', 'occupied', 'maintenance'],
        default: 'available'
    },
    pricePerHour: {
        type: Number,
        required: true
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

ParkingSlotSchema.index({ areaId: 1, slotNumber: 1 }, { unique: true });

const ParkingSlotModel = mongoose.model('ParkingSlot', ParkingSlotSchema);
module.exports = ParkingSlotModel;