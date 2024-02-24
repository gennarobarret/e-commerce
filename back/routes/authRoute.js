'use strict';

const express = require('express');
const AuthController = require('../controllers/AuthControllers');
const { loginLimiter } = require('../middlewares/rateLimit');
const api = express.Router();

api.post('/loginUser', loginLimiter, AuthController.loginUser);
api.post('/forgotPassword', AuthController.forgotPassword);
api.post('/resetPassword/:token', AuthController.resetPassword);
api.post('/auth/google', AuthController.authenticateWithGoogle);
api.post('/createMasterAdmin', AuthController.createMasterAdmin);
api.get('/activation/:token', AuthController.activateMasterAdmin);
api.post('/resendVerificationEmail', AuthController.resendVerificationEmail);

module.exports = api;
