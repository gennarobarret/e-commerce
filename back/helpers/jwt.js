require('dotenv').config();

"use strict";

var jwt = require("jwt-simple");
var moment = require("moment");

if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined in .env');
}

var secret = process.env.JWT_SECRET;

exports.createToken = function (user) {
    if (!user) {
        throw new Error("User data is required to create a token");
    }

    var payload = {
        sub: user._id,
        userName:user.userName,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        iat: moment().unix(),
        exp: moment().add(1, "days").unix(),
    };

    return jwt.encode(payload, secret);
};

// "use strict";
// var jwt = require("jwt-simple");
// var moment = require("moment");
// var secret = "javierbarreto";

// exports.createToken = function (user) {
//     var payload = {
//         sub: user._id,
//         firstName: user.firstName,
//         lastName: user.lastName,
//         email: user.email,
//         role: user.role,
//         iat: moment().unix(),
//         exp: moment().add(1, "days").unix(),
//     };
//     return jwt.encode(payload, secret);
// };
