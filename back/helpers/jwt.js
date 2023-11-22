"use strict";
var jwt = require("jwt-simple");
var moment = require("moment");
var secret = "javierbarreto";

exports.createToken = function (user) {
    var payload = {
        sub: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.rol,
        iat: moment().unix(),
        epx: moment().add(7, "days").unix(),
    };
    return jwt.encode(payload, secret);
};
