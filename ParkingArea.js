const mongoose = require('mongoose');

const ParkingAreaSchema = new mongoose.Schema({
    areaName: {
        type: String,
        required: true,
        unique: true
    },
    location: {
        type: String,
        required: true
    },
    totalFloors: {
        type: Number,
        required: true
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

const ParkingAreaModel = mongoose.model('ParkingArea', ParkingAreaSchema);
module.exports = ParkingAreaModel;