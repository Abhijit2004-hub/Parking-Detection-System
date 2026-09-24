const BookingModel = require('../Models/Booking');
const ParkingSlotModel = require('../Models/ParkingSlot');
const { default: mongoose } = require('mongoose');

const createBooking = async(req, res) => {
    try{
        const { slotId, vehicleNumber, vehicleType, startTime, endTime } = req.body;
        const userId = req.user._id;

        const slot = await ParkingSlotModel.findById(slotId);

        if(!slot){
            return res.status(404).json({
                message: "Parking slot not found",
                success: false
            });
        }

        if(slot.status !== 'available'){
            return res.status(400).json({
                message: "Parking slot is not available",
                success: false
            });
        }

        const start = new Date(startTime);
        const end = new Date(endTime);

        if (end <= start) {
            return res.status(400).json({
                message: "End time must be greater than start time",
                success: false
            });
        }

        const hours = Math.ceil((end - start) / (1000 * 60 * 60));
        const totalAmount = hours * slot.pricePerHour;

        const booking = new BookingModel({
            userId,
            slotId,
            vehicleNumber,
            vehicleType,
            startTime,
            endTime,
            totalAmount
        });

        await booking.save();

        slot.status = 'occupied';
        await slot.save();

        return res.status(201).json({
            message: "Booking created successfully",
            success: true,
            data: booking
        });
    }catch(err){
        console.error(err);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};

const viewAllBookings = async(req, res) => {
    try{
        const bookings = await BookingModel.find()
            .populate('userId', 'name email phone')
            .populate('slotId', 'slotNumber slotType floor pricePerHour');
        
        res.json({ success: true, data: bookings });
    }catch(err){
        res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};

const viewUserBookings = async(req, res) => {
    try{
        const userId = req.user._id;

        const bookings = await BookingModel.find({ userId })
            .populate('slotId', 'slotNumber slotType floor pricePerHour');
        
        res.json({ success: true, data: bookings });
    }catch(err){
        res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};

const getBookingById = async(req, res) => {
    try{
        const { id } = req.params;

        if(!mongoose.Types.ObjectId.isValid(id)){
            return res.status(400).json({
                message: "Invalid booking ID format",
                success: false
            });
        }

        const booking = await BookingModel.findById(id)
            .populate('userId', 'name email phone')
            .populate('slotId', 'slotNumber slotType floor pricePerHour');

        if(!booking){
            return res.status(404).json({
                message: "Booking not found",
                success: false
            });
        }

        return res.status(200).json({
            success: true,
            data: booking
        });
    }catch(err){
        console.error(err);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};

const completeBooking = async(req, res) => {
    try{
        const { id } = req.params;
        const { endTime } = req.body;

        if(!mongoose.Types.ObjectId.isValid(id)){
            return res.status(400).json({
                message: "Invalid booking ID",
                success: false
            });
        }

        const booking = await BookingModel.findById(id).populate('slotId');

        if(!booking){
            return res.status(404).json({
                message: "Booking not found",
                success: false
            });
        }

        const start = new Date(booking.startTime);
        const end = new Date(endTime);
        const hours = Math.ceil((end - start) / (1000 * 60 * 60));
        const totalAmount = hours * booking.slotId.pricePerHour;

        booking.endTime = endTime;
        booking.totalAmount = totalAmount;
        booking.status = 'completed';
        await booking.save();

        const slot = await ParkingSlotModel.findById(booking.slotId);
        slot.status = 'available';
        await slot.save();

        return res.status(200).json({
            message: "Booking completed successfully",
            success: true,
            data: booking
        });
    }catch(err){
        console.error(err);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};

const cancelBooking = async(req, res) => {
    try{
        const { id } = req.params;

        if(!mongoose.Types.ObjectId.isValid(id)){
            return res.status(400).json({
                message: "Invalid booking ID",
                success: false
            });
        }

        const booking = await BookingModel.findById(id);

        if(!booking){
            return res.status(404).json({
                message: "Booking not found",
                success: false
            });
        }

        booking.status = 'cancelled';
        await booking.save();

        const slot = await ParkingSlotModel.findById(booking.slotId);
        slot.status = 'available';
        await slot.save();

        return res.status(200).json({
            message: "Booking cancelled successfully",
            success: true,
            data: booking
        });
    }catch(err){
        console.error(err);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};

const bookingCount = async(req, res) => {
    try{
        const totalBookings = await BookingModel.countDocuments();
        const activeBookings = await BookingModel.countDocuments({ status: 'active' });
        const completedBookings = await BookingModel.countDocuments({ status: 'completed' });
        const cancelledBookings = await BookingModel.countDocuments({ status: 'cancelled' });

        res.json({
            total: totalBookings,
            active: activeBookings,
            completed: completedBookings,
            cancelled: cancelledBookings
        });
    }catch(err){
        console.error(err);
        res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};

const userCompleteBooking = async(req, res) => {
    try{
        const { id } = req.params;
        const userId = req.user._id;

        if(!mongoose.Types.ObjectId.isValid(id)){
            return res.status(400).json({
                message: "Invalid booking ID",
                success: false
            });
        }

        const booking = await BookingModel.findById(id).populate('slotId');

        if(!booking){
            return res.status(404).json({
                message: "Booking not found",
                success: false
            });
        }

        if(booking.userId.toString() !== userId.toString()){
            return res.status(403).json({
                message: "Unauthorized to complete this booking",
                success: false
            });
        }

        const totalAmount = booking.slotId.pricePerHour;

        booking.totalAmount = totalAmount;
        booking.status = 'completed';
        await booking.save();

        const slot = await ParkingSlotModel.findById(booking.slotId);
        slot.status = 'available';
        await slot.save();

        return res.status(200).json({
            message: "Booking completed successfully",
            success: true,
            data: booking
        });
    }catch(err){
        console.error(err);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};

module.exports = {
    createBooking,
    viewAllBookings,
    viewUserBookings,
    getBookingById,
    completeBooking,
    cancelBooking,
    bookingCount,
    userCompleteBooking
};