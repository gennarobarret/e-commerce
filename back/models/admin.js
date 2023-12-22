"use strict";
var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var TeamWorkSchema = Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    location: { type: String, required: false },
    phoneNumber: { type: String, required: false },
    role: { type: String, required: true },
    identification: { type: String, required: false },
    additionalInfo: { type: String, required: false },
    profileImage: { type: String, default: null, required: false },

});
module.exports = mongoose.model("teamWork", TeamWorkSchema);
