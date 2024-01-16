// userModel.js
"use strict";
var mongoose = require("mongoose");
var bcrypt = require("bcrypt");
var Schema = mongoose.Schema;

var UserSchema = Schema(
    {
        userName: {
            type: String,
            required: true,
            unique: true,
            minlength: 5,
            maxlength: 20,
            match: /^[a-zA-Z0-9]+$/,
        },
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        organizationName: { type: String },
        countryAddress: { type: String, required: true },
        stateAddress: { type: String, required: true },
        emailAddress: {
            type: String,
            required: true,
            unique: true,
            match: /.+\@.+\..+/,
        },
        password: { type: String, required: true },
        phoneNumber: { type: String },
        birthday: { type: Date },
        role: { type: String, enum: ['MasterAdministrator', 'Administrator', 'Registered', 'Editor', 'Guest'], required: true },
        groups: [{ type: String, enum: ['Sales', 'Developers', 'Marketing', 'Managers', 'Customer'] }],
        identification: { type: String },
        additionalInfo: { type: String },
        profileImage: { type: String, default: null },
    },
    { timestamps: true }
);

UserSchema.pre("save", function (next) {
    if (this.isModified("password")) {
        this.password = bcrypt.hashSync(this.password, bcrypt.genSaltSync(10));
        console.log("Hashed password:", this.password);
    }
    next();
});

module.exports = mongoose.model("user", UserSchema);
