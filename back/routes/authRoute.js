"use strict";

const express = require("express");
const authController = require("../controllers/AuthControllers");
const api = express.Router();

api.post("/loginUser", authController.loginUser);

module.exports = api;
