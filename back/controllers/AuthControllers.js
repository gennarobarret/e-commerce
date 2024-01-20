require('dotenv').config();

'use strict';
const MAX_LOGIN_ATTEMPTS = parseInt(process.env.MAX_LOGIN_ATTEMPTS);
const LOCK_TIME = parseInt(process.env.LOCK_TIME);
const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const { ErrorHandler, handleError } = require("../helpers/errorHandler");
const { createSuccessfulResponse } = require("../helpers/responseHelper");
const { validateLogin } = require("../helpers/validate");
const logger = require('../helpers/logHelper');
const jwt = require("../helpers/jwt");
const transporter = require('../helpers/mailHelper');

// LOGIN ADMIN
const loginUser = async (req, res) => {
    try {
        if (isNaN(MAX_LOGIN_ATTEMPTS) || isNaN(LOCK_TIME)) {
            throw new Error("MAX LOGIN ATTEMPTS and LOCK_TIME environment variables must be set and be valid numbers.");
        }
        if (!req.body.password) {
            throw new ErrorHandler(400, "Password is required");
        }
        const { error } = validateLogin(req.body);
        if (error) {
            logger.error("Validation error");
            throw new ErrorHandler(400, "Invalid input", error.details);
        }
        logger.info('Login attempt for userName:', req.body.userName);
        const user = await User.findOne({ userName: req.body.userName }).select('+password');
        if (!user) {
            throw new ErrorHandler(401, "invalid credentials");
        }
        logger.info('User found. Comparing passwords...');
        if (user.isBlocked) {
            logger.error("user block error");
            throw new ErrorHandler(403, "Account is temporarily locked. Try again later.");
        }
        const check = await bcrypt.compare(req.body.password, user.password);
        if (check) {
            if (user.loginAttempts !== 0) {
                user.loginAttempts = 0;
                user.lockUntil = null;
                await user.save();
            }
            logger.info('Password match. Logging in...');
            // res.status(200).send({ data: user, token: jwt.createToken(user) });
            res.status(200).json(createSuccessfulResponse("Login successful", { user: user, token: jwt.createToken(user) }));
        } else {
            user.loginAttempts += 1;
            if (user.loginAttempts >= MAX_LOGIN_ATTEMPTS && !user.isBlocked) {
                user.lockUntil = Date.now() + LOCK_TIME;
            }
            await user.save();
            throw new ErrorHandler(401, "invalid credentials");
        }
    } catch (error) {
        logger.error("Server error:", error);
        handleError(error, res);
    }
};

// FORGOT PASSWORD ADMIN
const forgotPassword = async (req, res) => {
    try {
        const { emailAddress } = req.body;
        const user = await User.findOne({ emailAddress });
        if (!user) {
            // Enviar respuesta incluso si el correo no existe por seguridad
            return res.status(200).json(createSuccessfulResponse("If the email exists in our system, a password reset link will be sent."));
        }

        // Generar token de reseteo
        const resetToken = user.generatePasswordResetToken();
        await user.save();

        // Enviar correo con el token
        const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
        await sendPasswordResetEmail(user.emailAddress, resetUrl);

        res.status(200).json(createSuccessfulResponse("Password reset link sent to email if it exists in our system."));
    } catch (error) {
        logger.error("Forgot password error:", error);
        handleError(error, res);
    }
};

const sendPasswordResetEmail = async (email, resetUrl) => {
    const mailOptions = {
        from: '"Nombre de tu Aplicación" <tuemail@example.com>',
        to: email,
        subject: "Restablecimiento de Contraseña",
        text: `Por favor, usa el siguiente enlace para restablecer tu contraseña: ${resetUrl}`,
        html: `<p>Por favor, usa el siguiente enlace para restablecer tu contraseña: <a href="${resetUrl}">Restablecer Contraseña</a></p>`,
    };

    await transporter.sendMail(mailOptions);
};

module.exports = {
    loginUser,
    forgotPassword,
};



// ### Consideraciones Adicionales:

// - ** Seguridad:** Asegúrate de que el token de restablecimiento de contraseña sea seguro y de uso único.También es importante que expire después de un período razonable.

// - ** Correo Electrónico:** La función `sendPasswordResetEmail` debe implementarse para enviar el correo electrónico.
