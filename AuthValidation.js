const Joi = require('joi');

const adminSignupValidation = (req, res, next) => {
    const schema = Joi.object({
        name: Joi.string().min(3).max(100).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(4).max(100).required()
    });

    const { error } = schema.validate(req.body);
    if(error){
        return res.status(400).json({ message: "Bad Request", error });
    }
    next();
};

const userSignupValidation = (req, res, next) => {
    const schema = Joi.object({
        name: Joi.string().min(3).max(100).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(4).max(100).required(),
        phone: Joi.string().min(10).max(15).required()
    });

    const { error } = schema.validate(req.body);
    if(error){
        return res.status(400).json({ message: "Bad Request", error });
    }
    next();
};

const loginValidation = (req, res, next) => {
    const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(4).max(100).required()
    });

    const { error } = schema.validate(req.body);
    if(error){
        return res.status(400).json({ message: "Bad Request", error });
    }
    next();
};

const parkingAreaValidation = (req, res, next) => {
    const schema = Joi.object({
        areaName: Joi.string().required(),
        location: Joi.string().required(),
        totalFloors: Joi.number().min(1).max(10).required()
    });

    const { error } = schema.validate(req.body);
    if(error){
        return res.status(400).json({ message: "Bad Request", error });
    }
    next();
};

const parkingSlotValidation = (req, res, next) => {
    const schema = Joi.object({
        areaId: Joi.string().required(),
        slotNumber: Joi.string().required(),
        slotType: Joi.string().valid('two-wheeler', 'four-wheeler', 'heavy-vehicle').required(),
        floor: Joi.number().required(),
        pricePerHour: Joi.number().required(),
        status: Joi.string().valid('available', 'occupied', 'maintenance').default('available')
    });

    const { error } = schema.validate(req.body);
    if(error){
        return res.status(400).json({ message: "Bad Request", error });
    }
    next();
};

const bookingValidation = (req, res, next) => {
    const schema = Joi.object({
        slotId: Joi.string().required(),
        vehicleNumber: Joi.string().required(),
        vehicleType: Joi.string()
            .valid('two-wheeler', 'four-wheeler', 'heavy-vehicle')
            .required(),
        startTime: Joi.date().required(),
        endTime: Joi.date().greater(Joi.ref('startTime')).required()
    });

    const { error } = schema.validate(req.body);

    if (error) {
        return res.status(400).json({
            message: error.details[0].message
        });
    }

    next();
};

module.exports = {
    adminSignupValidation,
    userSignupValidation,
    loginValidation,
    parkingAreaValidation,
    parkingSlotValidation,
    bookingValidation
};