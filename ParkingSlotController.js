const ParkingSlotModel = require('../Models/ParkingSlot');
const { default: mongoose } = require('mongoose');

const addParkingSlot = async (req, res) => {
    try {
        const { areaId, slotNumber, slotType, floor, pricePerHour, status } = req.body;

        if (!mongoose.Types.ObjectId.isValid(areaId)) {
            return res.status(400).json({
                message: "Invalid area ID",
                success: false
            });
        }

        const slot = await ParkingSlotModel.findOne({ areaId, slotNumber, floor });

        if (slot) {
            return res.status(409).json({
                message: "Parking slot already exists on this floor",
                success: false
            });
        }

        const parkingSlot = new ParkingSlotModel({
            areaId,
            slotNumber,
            slotType,
            floor,
            pricePerHour,
            status: status || 'available'
        });

        await parkingSlot.save();

        return res.status(201).json({
            message: "Parking slot added successfully",
            success: true,
            data: parkingSlot
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            message: "Internal server error",
            success: false,
            error: err.message
        });
    }
};

const viewAllSlots = async (req, res) => {
    try {
        const slots = await ParkingSlotModel.find({ isDeleted: false }).populate('areaId');
        res.json({ success: true, data: slots });
    } catch (err) {
        res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};

const viewSlotsByArea = async (req, res) => {
    try {
        const { areaId } = req.params;
        const slots = await ParkingSlotModel.find({ areaId, isDeleted: false }).populate('areaId');
        res.json({ success: true, data: slots });
    } catch (err) {
        res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};

const viewAvailableSlots = async (req, res) => {
    try {
        const slots = await ParkingSlotModel.find({ status: 'available', isDeleted: false }).populate('areaId');
        res.json({ success: true, data: slots });
    } catch (err) {
        res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};

const viewAvailableSlotsByArea = async (req, res) => {
    try {
        const { areaId } = req.params;
        const slots = await ParkingSlotModel.find({ 
            areaId, 
            status: 'available', 
            isDeleted: false 
        }).populate('areaId');
        res.json({ success: true, data: slots });
    } catch (err) {
        res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};

const getSlotById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                message: "Invalid slot ID format",
                success: false
            });
        }

        const slot = await ParkingSlotModel.findById(id).populate('areaId');

        if (!slot) {
            return res.status(404).json({
                message: "Slot not found",
                success: false
            });
        }

        return res.status(200).json({
            success: true,
            data: slot
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};

const updateSlotById = async (req, res) => {
    try {
        const id = req.params.id?.trim();

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                message: "Invalid slot ID",
                success: false
            });
        }

        const updateData = req.body;
        const updatedSlot = await ParkingSlotModel.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        ).populate('areaId');

        if (!updatedSlot) {
            return res.status(404).json({
                message: "Slot not found",
                success: false
            });
        }

        return res.status(200).json({
            message: "Slot updated successfully",
            success: true,
            data: updatedSlot
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};

const deleteSlotById = async (req, res) => {
    try {
        const id = req.params.id.trim();

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                message: "Invalid slot ID",
                success: false
            });
        }

        const deletedSlot = await ParkingSlotModel.findByIdAndDelete(id);

        if (!deletedSlot) {
            return res.status(404).json({
                message: "Slot not found",
                success: false
            });
        }

        return res.status(200).json({
            message: "Slot deleted successfully",
            success: true,
            data: deletedSlot
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};

const slotCount = async (req, res) => {
    try {
        const totalSlots = await ParkingSlotModel.countDocuments({ isDeleted: false });
        const availableSlots = await ParkingSlotModel.countDocuments({ status: 'available', isDeleted: false });
        const occupiedSlots = await ParkingSlotModel.countDocuments({ status: 'occupied', isDeleted: false });
        const maintenanceSlots = await ParkingSlotModel.countDocuments({ status: 'maintenance', isDeleted: false });

        res.json({
            total: totalSlots,
            available: availableSlots,
            occupied: occupiedSlots,
            maintenance: maintenanceSlots
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};

const getAreaSlotStats = async (req, res) => {
    try {
        const { areaId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(areaId)) {
            return res.status(400).json({
                message: "Invalid area ID",
                success: false
            });
        }

        const slots = await ParkingSlotModel.find({ areaId, isDeleted: false });

        const stats = {
            total: slots.length,
            available: slots.filter(s => s.status === 'available').length,
            occupied: slots.filter(s => s.status === 'occupied').length,
            maintenance: slots.filter(s => s.status === 'maintenance').length,
            byType: {
                'two-wheeler': {
                    total: slots.filter(s => s.slotType === 'two-wheeler').length,
                    available: slots.filter(s => s.slotType === 'two-wheeler' && s.status === 'available').length,
                    occupied: slots.filter(s => s.slotType === 'two-wheeler' && s.status === 'occupied').length
                },
                'four-wheeler': {
                    total: slots.filter(s => s.slotType === 'four-wheeler').length,
                    available: slots.filter(s => s.slotType === 'four-wheeler' && s.status === 'available').length,
                    occupied: slots.filter(s => s.slotType === 'four-wheeler' && s.status === 'occupied').length
                },
                'heavy-vehicle': {
                    total: slots.filter(s => s.slotType === 'heavy-vehicle').length,
                    available: slots.filter(s => s.slotType === 'heavy-vehicle' && s.status === 'available').length,
                    occupied: slots.filter(s => s.slotType === 'heavy-vehicle' && s.status === 'occupied').length
                }
            }
        };

        res.json({ success: true, data: stats });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};

module.exports = {
    addParkingSlot,
    viewAllSlots,
    viewSlotsByArea,
    viewAvailableSlots,
    viewAvailableSlotsByArea,
    getSlotById,
    updateSlotById,
    deleteSlotById,
    slotCount,
    getAreaSlotStats
};