"use strict";

var express = require("express");
var adminController = require("../controllers/AdminController");

var api = express.Router();

api.post("/create_admin", adminController.create_admin);
api.post("/login_admin", adminController.login_admin);

module.exports = api;
