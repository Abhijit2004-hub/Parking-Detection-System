const router = require('express').Router();

const { 
    adminSignupValidation, 
    userSignupValidation, 
    loginValidation,
    parkingAreaValidation,
    parkingSlotValidation, 
    bookingValidation 
} = require('../Middlewares/AuthValidation');

const { adminSignup, adminLogin } = require('../Controllers/AdminController');
const { userSignup, userLogin } = require('../Controllers/UserController');
const { 
    addParkingArea,
    viewAllAreas,
    getAreaById,
    updateAreaById,
    deleteAreaById
} = require('../Controllers/ParkingAreaController');
const { 
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
} = require('../Controllers/ParkingSlotController');
const { 
    createBooking, 
    viewAllBookings, 
    viewUserBookings, 
    getBookingById, 
    completeBooking, 
    cancelBooking, 
    bookingCount,
    userCompleteBooking
} = require('../Controllers/BookingController');

const adminValidate = require('../Middlewares/AdminJwt');
const userValidate = require('../Middlewares/UserJwt');

// Admin routes
router.post('/admin/signup', adminSignupValidation, adminSignup);
router.post('/admin/login', loginValidation, adminLogin);

// User routes
router.post('/user/signup', userSignupValidation, userSignup);
router.post('/user/login', loginValidation, userLogin);

// Parking Area routes (Admin only)
router.post('/area/add', adminValidate, parkingAreaValidation, addParkingArea);
router.get('/area/view-all', viewAllAreas);
router.get('/area/view/:id', getAreaById);
router.patch('/area/update/:id', adminValidate, updateAreaById);
router.delete('/area/delete/:id', adminValidate, deleteAreaById);

// Parking slot routes
router.post('/slot/add', adminValidate, parkingSlotValidation, addParkingSlot);
router.get('/slot/view-all', viewAllSlots);
router.get('/slot/view-by-area/:areaId', viewSlotsByArea);
router.get('/slot/view-available', viewAvailableSlots);
router.get('/slot/view-available/:areaId', viewAvailableSlotsByArea);
router.get('/slot/view/:id', getSlotById);
router.patch('/slot/update/:id', adminValidate, updateSlotById);
router.delete('/slot/delete/:id', adminValidate, deleteSlotById);
router.get('/slot/count', slotCount);
router.get('/slot/area-stats/:areaId', getAreaSlotStats);

// Booking routes
router.post('/booking/create', userValidate, bookingValidation, createBooking);
router.get('/booking/view-all', adminValidate, viewAllBookings);
router.get('/booking/my-bookings', userValidate, viewUserBookings);
router.get('/booking/view/:id', getBookingById);
router.patch('/booking/complete/:id', adminValidate, completeBooking);
router.patch('/booking/cancel/:id', userValidate, cancelBooking);
router.patch('/booking/user-complete/:id', userValidate, userCompleteBooking);
router.get('/booking/count', adminValidate, bookingCount);

module.exports = router;