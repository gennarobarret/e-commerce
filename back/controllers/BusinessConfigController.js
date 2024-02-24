const BusinessConfig = require("../models/businessConfigModel");
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

// CREATE BUSINESS CONFIGURATION
const createBusinessConfig = async (req, res) => {
    try {
        const businessConfigData = req.body;
        const businessConfig = new BusinessConfig(businessConfigData);
        await businessConfig.save();
        res.status(201).json(createSuccessfulResponse("Business configuration created successfully.", { businessConfigId: businessConfig._id }));
    } catch (error) {
        logger.error('createBusinessConfig error:', error);
        handleControllerError(error, res);
    }
};

// UPDATE BUSINESS CONFIGURATION
const updateBusinessConfig = async (req, res) => {
    try {
        const { businessConfigId } = req.params;
        const updateData = req.body;
        const businessConfig = await BusinessConfig.findByIdAndUpdate(businessConfigId, updateData, { new: true });
        if (!businessConfig) {
            throw new ErrorHandler(404, "Business configuration not found.");
        }
        res.status(200).json(createSuccessfulResponse("Business configuration updated successfully.", { businessConfig }));
    } catch (error) {
        logger.error('updateBusinessConfig error:', error);
        handleControllerError(error, res);
    }
};

// GET BUSINESS CONFIGURATION
const getBusinessConfig = async (req, res) => {
    try {
        const businessConfig = await BusinessConfig.findOne(); // Assuming there's only one business config
        if (!businessConfig) {
            throw new ErrorHandler(404, "Business configuration not found.");
        }
        res.status(200).json(createSuccessfulResponse("Business configuration retrieved successfully.", { businessConfig }));
    } catch (error) {
        logger.error('getBusinessConfig error:', error);
        handleControllerError(error, res);
    }
};

module.exports = {
    createBusinessConfig,
    updateBusinessConfig,
    getBusinessConfig
};
