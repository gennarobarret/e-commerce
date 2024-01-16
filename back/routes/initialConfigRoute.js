"use strict";

const express = require("express");
const InitialConfigController = require("../controllers/InitialConfigController");
const api = express.Router();

api.get("/InitialCheck", InitialConfigController.InitialCheck);
api.post("/createMasterAdmin", InitialConfigController.createMasterAdmin);

module.exports = api;
