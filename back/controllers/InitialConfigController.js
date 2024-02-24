// initialCofigController.js
const User = require("../models/userModel");
const { ErrorHandler, handleError } = require("../helpers/errorHandler");
const { createSuccessfulResponse } = require("../helpers/responseHelper");
const logger = require('../helpers/logHelper');

const handleControllerError = (error, res) => {
    logger.error('controller error:', error);
    if (!(error instanceof ErrorHandler)) {
        error = new ErrorHandler(500, error.message || "Server error");
    }
    handleError(error, res);
};

// INITIAL CHECK
const InitialCheck = async (req, res) => {
    try {
        const masterAdmin = await User.findOne({ role: 'MasterAdministrator' });
        let setupRequired = false;
        let verificationRequired = false;
        let message = "";

        if (!masterAdmin) {
            message = "No MasterAdmin found, ready for initial setup";
            setupRequired = true;
        } else if (masterAdmin.Verification !== 'active') {
            message = "MasterAdmin is not verified";
            verificationRequired = true;
        } else {
            message = "Master Administrator is already verified, ready for login";
        }

        res.status(200).json(createSuccessfulResponse(message, { setupRequired, verificationRequired }));
    } catch (error) {
        handleControllerError(error, res);
    }
};



module.exports = {
    InitialCheck
};

