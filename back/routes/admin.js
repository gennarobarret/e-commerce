"use strict";

var express = require("express");
var adminController = require("../controllers/AdminController");
var api = express.Router();
var auth = require("../middlewares/authenticate");
var api = express.Router();

api.get('/check_admin_exists', adminController.check_admin_exists);
api.post("/create_admin", adminController.create_admin);
api.post("/login_admin", adminController.login_admin);
api.get("/get_admin", auth.auth, adminController.get_admin);
api.post("/get_admin_picture", adminController.get_admin_picture);
api.post("/update_admin", adminController.update_admin);

module.exports = api;
