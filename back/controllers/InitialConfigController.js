// initialCofigController.js

const User = require("../models/userModel");
const { ErrorHandler, handleError } = require("../helpers/errorHandler");
const { createSuccessfulResponse } = require("../helpers/responseHelper");
const { validateUser } = require("../helpers/validate");
const logger = require('../helpers/logHelper');

const handleControllerError = (error, res) => {
    logger.error('controller error:', error);
    handleError(new ErrorHandler(500, "Server error"), res);
};

// INITIAL CHECK
const InitialCheck = async (req, res) => {
    try {
        const masterAdminExists = await User.exists({ role: 'MasterAdministrator' });
        const message = masterAdminExists
            ? "MasterAdmin already setup"
            : "No MasterAdmin found, ready for initial setup";
        const setupRequired = !masterAdminExists;

        res.status(200).json(createSuccessfulResponse(message, { setupRequired }));
    } catch (error) {
        handleControllerError(error, res);
    }
};

// CREATE MASTER ADMIN
const createMasterAdmin = async (req, res) => {
    try {
        const masterAdminExists = await User.exists({ role: 'MasterAdministrator' });
        if (masterAdminExists) {
            throw new ErrorHandler(400, "MasterAdmin already exists. Initial setup already completed.");
        }

        const validation = validateUser(req.body);
        if (validation.error) {
            throw new ErrorHandler(400, validation.error.details.map(detail => detail.message).join(", "));
        }

        const masterAdmin = new User({ ...req.body, role: 'MasterAdministrator' });
        await masterAdmin.save();

        res.status(200).json(createSuccessfulResponse("MasterAdmin created successfully", { user: masterAdmin }));
    } catch (error) {
        handleControllerError(error, res);
    }
};

module.exports = {
    InitialCheck,
    createMasterAdmin
};
