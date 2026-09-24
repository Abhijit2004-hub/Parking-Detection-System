const ParkingAreaModel = require('../Models/ParkingArea');
const { default: mongoose } = require('mongoose');

const addParkingArea = async (req, res) => {
    try {
        const { areaName, location, totalFloors } = req.body;

        const area = await ParkingAreaModel.findOne({ areaName });

        if (area) {
            return res.status(409).json({
                message: "Parking area already exists",
                success: false
            });
        }

        const parkingArea = new ParkingAreaModel({
            areaName,
            location,
            totalFloors
        });

        await parkingArea.save();

        return res.status(201).json({
            message: "Parking area added successfully",
            success: true,
            data: parkingArea
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};

const viewAllAreas = async (req, res) => {
    try {
        const areas = await ParkingAreaModel.find({ isDeleted: false });
        res.json({ success: true, data: areas });
    } catch (err) {
        res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};

const getAreaById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                message: "Invalid area ID format",
                success: false
            });
        }

        const area = await ParkingAreaModel.findById(id);

        if (!area) {
            return res.status(404).json({
                message: "Area not found",
                success: false
            });
        }

        return res.status(200).json({
            success: true,
            data: area
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};

const updateAreaById = async (req, res) => {
    try {
        const id = req.params.id?.trim();

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                message: "Invalid area ID",
                success: false
            });
        }

        const updateData = req.body;
        const updatedArea = await ParkingAreaModel.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        );

        if (!updatedArea) {
            return res.status(404).json({
                message: "Area not found",
                success: false
            });
        }

        return res.status(200).json({
            message: "Area updated successfully",
            success: true,
            data: updatedArea
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};

const deleteAreaById = async (req, res) => {
    try {
        const id = req.params.id.trim();

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                message: "Invalid area ID",
                success: false
            });
        }

        const deletedArea = await ParkingAreaModel.findByIdAndDelete(id);

        if (!deletedArea) {
            return res.status(404).json({
                message: "Area not found",
                success: false
            });
        }

        return res.status(200).json({
            message: "Area deleted successfully",
            success: true,
            data: deletedArea
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};

module.exports = {
    addParkingArea,
    viewAllAreas,
    getAreaById,
    updateAreaById,
    deleteAreaById
};