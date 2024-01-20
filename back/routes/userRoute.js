"use strict";

const express = require("express");
const userManagement = require("../controllers/UserManagementController");
const auth = require("../middlewares/authenticate");
const rbac = require('../middlewares/rbacMiddleware');
const multiparty = require("connect-multiparty");
const path = multiparty({ uploadDir: "./uploads/profile" });
const api = express.Router();

api.post("/createUser", userManagement.createUser);
api.get("/getUser", auth.auth, userManagement.getUser);
api.get("/geUserImage/:img", auth.auth, userManagement.geUserImage);
api.put("/updateUser", [auth.auth, path], userManagement.updateUser);


module.exports = api;
