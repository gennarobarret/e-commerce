"use strict";
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Schema = mongoose.Schema;
const crypto = require('crypto');

var UserSchema = new Schema({
    userName: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 5,
        maxlength: 20,
        match: /^[a-zA-Z0-9]+$/
    },
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    organizationName: {
        type: String,
        minlength: 3,
        maxlength: 30,
        trim: true
    },
    countryAddress: {
        type: String,
        trim: true
    },
    stateAddress: {
        type: String,
        trim: true
    },
    googleId: String,
    emailAddress: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        validate: {
            validator: function (email) {
                return /^(([^<>()\[\]\\.,;:\s@\"]+(\.[^<>()\[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email);
            },
            message: props => `${props.value}  it is not a valid mail`
        }
    },
    password: {
        type: String,
        required: function () { return this.authMethod === 'local'; },
        select: false,
        validate: {
            validator: function (v) {
                return /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm.test(v);
            },
            message: props => `${props.value} The password must be at least 8 characters and contain numbers, upper and lower case letters, and special characters.`,
        }
    },
    phoneNumber: {
        type: String,
        trim: true
    },
    birthday: {
        type: Date
    },
    role: {
        type: String,
        enum: ['MasterAdministrator', 'Administrator', 'Registered', 'Editor', 'Guest'],
        required: true,
        default: 'Registered' // Valor predeterminado añadido
    },
    authMethod: {
        type: String,
        required: true,
        enum: ['local', 'google', 'github'],
        default: 'local'
    },
    groups: {
        type: [{
            type: String,
            enum: ['Sales', 'Developers', 'Marketing', 'Managers', 'Customer']
        }],
        required: true
    },
    identification: {
        type: String,
        trim: true
    },
    additionalInfo: {
        type: String,
        trim: true
    },
    profileImage: {
        type: String,
        trim: true,
        default: null
    },
    loginAttempts: {
        type: Number,
        required: true,
        default: 0
    },
    lockUntil: {
        type: Number
    },
    configurationToken: {
        type: String,
        default: null
    },
    configurationTokenExpires: {
        type: Date,
        default: null
    },
    Verification: {
        type: String,
        enum: ['active', 'notActivate'],
        required: true,
        default: 'notActivate'
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    emailNotifications: {
        accountChanges: { type: Boolean, default: false },
        groupChanges: { type: Boolean, default: false },
        productUpdates: { type: Boolean, default: false },
        newProducts: { type: Boolean, default: false },
        marketingOffers: { type: Boolean, default: false },
        securityAlerts: { type: Boolean, default: false }
    },
}, { timestamps: true });

UserSchema.methods.generateConfigurationToken = function () {
    const token = crypto.randomBytes(20).toString('hex');
    this.configurationToken = token;
    this.configurationTokenExpires = Date.now() + 3600000; // 1 hora
    return token;
};

UserSchema.virtual('isBlocked').get(function () {
    return !!(this.lockUntil && this.lockUntil > Date.now());
});



UserSchema.methods.generatePasswordResetToken = function () {
    const resetToken = crypto.randomBytes(32).toString('hex');
    this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    this.resetPasswordExpires = Date.now() + 3600000; // 1 hora
    return resetToken;
};

UserSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    }
    next();
});

module.exports = mongoose.model("user", UserSchema);

