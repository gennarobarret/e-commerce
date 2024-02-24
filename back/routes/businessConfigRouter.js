"use strict";

const express = require("express");
const BusinessConfigController = require("../controllers/BusinessConfigController");
const api = express.Router();

api.post("/createBusinessConfig", BusinessConfigController.createBusinessConfig);
api.put("/updateBusinessConfig", BusinessConfigController.updateBusinessConfig);
api.get("/getBusinessConfig", BusinessConfigController.getBusinessConfig);

module.exports = api;
