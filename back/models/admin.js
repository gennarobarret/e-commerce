"use strict";
var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var TeamWorkSchema = Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    phoneNumber: { type: String, required: false },
    role: { type: String, required: true },
    dni: { type: String, required: true },
    additionalInfo: { type: String, required: true },
    profileImage: { type: String, default: null, required: false },

});
module.exports = mongoose.model("teamWork", TeamWorkSchema);
