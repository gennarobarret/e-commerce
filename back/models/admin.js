"use strict";
var mongoose = require("mongoose");
var bcrypt = require("bcrypt");
var Schema = mongoose.Schema;

var TeamWorkSchema = Schema(
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
        address: {
            street1: { type: String, required: true },
            street2: { type: String },
            city: { type: String },
            state: { type: String, required: true },
            zip: { type: String },
            country: { type: String, required: true }
        },
        emailAddress: {
            type: String,
            required: true,
            unique: true,
            match: /.+\@.+\..+/,
        },
        password: { type: String, required: true },
        phoneNumber: { type: String },
        birthday: { type: Date },
        role: { type: String, required: true, enum: ["admin", "user", "guest"] },
        identification: { type: String },
        additionalInfo: { type: String },
        profileImage: { type: String, default: null },
    },
    { timestamps: true }
);

// Middleware para hashear la contraseña antes de guardar
TeamWorkSchema.pre('save', function(next) {
    if (this.isModified('password')) {
        this.password = bcrypt.hashSync(this.password, bcrypt.genSaltSync(10));
        console.log('Hashed password:', this.password);
    }
    next();
});

module.exports = mongoose.model("teamWork", TeamWorkSchema);



// "use strict";
// var mongoose = require("mongoose");
// var Schema = mongoose.Schema;

// var TeamWorkSchema = Schema(
//     {
//         userName: {
//             type: String,
//             required: true,
//             unique: true,
//             minlength: 5,
//             maxlength: 20,
//             match: /^[a-zA-Z0-9]+$/,
//         },
        
//         firstName: { type: String, required: true },
//         lastName: { type: String, required: true },
//         organizationName: { type: String, required: false },
//         street1: { type: String, required: true },
//         street2: { type: String, required: false },
//         city: { type: String, required: false },
//         state: { type: String, required: true },
//         zip: { type: String, required: false },
//         country: { type: String, required: true },
//         emailAddress: {
//             type: String,
//             required: true,
//             unique: true,
//             match: /.+\@.+\..+/,
//         },
//         password: { type: String, required: true },
//         phoneNumber: { type: String, required: false },
//         birthday: { type: Date, required: false },
//         role: { type: String, required: true, enum: ["admin", "user", "guest"] },
//         identification: { type: String, required: false },
//         additionalInfo: { type: String, required: false },
//         profileImage: { type: String, default: null, required: false },
//     },
//     { timestamps: true }
// );
// module.exports = mongoose.model("teamWork", TeamWorkSchema);
