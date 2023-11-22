"use strict";
var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var AdminSchema = Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    phoneNumber: { type: String, required: false },
    rol: { type: String, required: true },
    dni: { type: String, required: true },
});
module.exports = mongoose.model("admin", AdminSchema);
