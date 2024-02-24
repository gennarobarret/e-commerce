"use strict";
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var BusinessConfigSchema = new Schema({
    businessName: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100
    },
    taxId: {
        type: String,
        required: true,
        trim: true,
        match: /^[A-Z0-9]+$/,
    },
    taxType: {
        type: String,
        required: true,
        trim: true,
        enum: ['IVA', 'ISR', 'OTHER'], // Ejemplo de tipos de impuestos, ajusta según necesidad
    },
    taxPercentage: {
        type: Number,
        required: true,
        min: 0,
        max: 100, // Asume que el porcentaje es un valor entre 0 y 100
        validate: {
            validator: function (value) {
                return value >= 0 && value <= 100;
            },
            message: props => `${props.value} is not a valid tax percentage. It must be between 0 and 100.`
        }
    },
    paymentGateway: {
        type: String,
        required: true
    },
    physicalLocation: {
        type: String,
        required: true,
        trim: true
    },
    shippingService: {
        type: String,
        required: true,
        trim: true
    },
    companyEmail: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        validate: {
            validator: function (email) {
                return /^(([^<>()\[\]\\.,;:\s@\"]+(\.[^<>()\[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email);
            },
            message: props => `${props.value} is not a valid email`
        }
    },
    customerServiceEmail: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        validate: {
            validator: function (email) {
                return /^(([^<>()\[\]\\.,;:\s@\"]+(\.[^<>()\[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email);
            },
            message: props => `${props.value} is not a valid email`
        }
    },
    returnsEmail: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        validate: {
            validator: function (email) {
                return /^(([^<>()\[\]\\.,;:\s@\"]+(\.[^<>()\[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email);
            },
            message: props => `${props.value} is not a valid email`
        }
    },
    currency: {
        type: String,
        required: true,
        trim: true
    },
    logo: {
        type: String, // Assuming you're storing the path to the logo image
        trim: true,
        default: null
    }
}, { timestamps: true });

module.exports = mongoose.model("BusinessConfig", BusinessConfigSchema);
