"use strict";

const express = require("express");
const AuthController = require("../controllers/AuthControllers");
const { loginLimiter } = require('../middlewares/rateLimit');
const api = express.Router();

api.post("/loginUser", loginLimiter, AuthController.loginUser);

module.exports = api;
