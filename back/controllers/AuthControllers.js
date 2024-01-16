"strict";

const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("../helpers/jwt");

// LOGIN ADMIN
const loginUser = async (req, res) => {
    try {
        const data = req.body;

        console.log('Login attempt for userName:', data.userName);

        const userName = await User.findOne({ userName: data.userName });

        if (!userName) {
            console.log('UserName not found:', data.userName);

            return res
                .status(404)
                .send({ message: "UserName not found", data: undefined });
        }
        console.log('User found. Comparing passwords...');

        bcrypt.compare(data.password, userName.password, async (error, check) => {
            if (check) {
                console.log('Password match. Logging in...');

                res.status(200).send({ data: userName, token: jwt.createToken(userName) });
            } else {
                console.log('Incorrect password for userName:', data.userName);

                res
                    .status(401)
                    .send({ message: "Incorrect password", data: undefined });
            }
        });
    } catch (error) {
        console.error("Server error:", error.message);
        res.status(500).send({ message: "Server error", data: undefined });
    }
};

// FORGOT PASSWORD ADMIN
const forgotPassword = async (req, res) => {
    // Lógica para manejar la solicitud de recuperación de contraseña
};

module.exports = {
    loginUser,
    forgotPassword,
};
