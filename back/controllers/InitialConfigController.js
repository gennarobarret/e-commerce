// controllers/InitialConfigController.js

const User = require("../models/userModel");
const { ErrorHandler, handleError } = require("../helpers/errorHandler");
const { createSuccessfulResponse } = require("../helpers/responseHelper");
const { validateUser } = require("../helpers/validate");

// INITIAL CHECK
const InitialCheck = async (req, res) => {
    try {
        const masterAdminCount = await User.countDocuments({ role: 'MasterAdministrator' });
        if (masterAdminCount === 0) {
            res.status(200).json(createSuccessfulResponse("No MasterAdmin found, ready for initial setup", { setupRequired: true }));
        } else {
            res.status(200).json(createSuccessfulResponse("MasterAdmin already setup", { setupRequired: false }));
        }
    } catch (error) {
        handleError(new ErrorHandler(500, "Server error"), res);
    }
};

// CREATE MASTER ADMIN
const createMasterAdmin = async (req, res) => {
    try {
        const masterAdminCount = await User.countDocuments({ role: 'MasterAdministrator' });
        if (masterAdminCount > 0) {
            return handleError(new ErrorHandler(400, "MasterAdmin already exists. Initial setup already completed."), res);
        }

        const validation = validateUser(req.body);
        if (validation.error) {
            return handleError(new ErrorHandler(400, validation.error.message), res);
        }

        const { userName, firstName, lastName, emailAddress, password, ...otherData } = req.body;

        const masterAdmin = new User({
            userName,
            firstName,
            lastName,
            emailAddress,
            password,
            role: 'MasterAdministrator',
            ...otherData
        });

        await masterAdmin.save();
        res.status(200).json(createSuccessfulResponse("MasterAdmin created successfully", { user: masterAdmin }));

    } catch (error) {
        handleError(new ErrorHandler(500, "Server error"), res);
    }
};

module.exports = {
    InitialCheck,
    createMasterAdmin
};
