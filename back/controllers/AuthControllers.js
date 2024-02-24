require('dotenv').config();

'use strict';
const MAX_LOGIN_ATTEMPTS = parseInt(process.env.MAX_LOGIN_ATTEMPTS);
const LOCK_TIME = parseInt(process.env.LOCK_TIME);
const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const crypto = require('crypto');
const { ErrorHandler, handleError } = require("../helpers/errorHandler");
const { createSuccessfulResponse } = require("../helpers/responseHelper");
const logger = require('../helpers/logHelper');
const jwt = require("../helpers/jwt");
const transporter = require('../helpers/mailHelper');
const { validateUser } = require("../helpers/validate");
const { validateLogin } = require("../helpers/validate");
const generateUserName = require('../helpers/userNameGenerator.js');
const { checkIfAdminEmail } = require('../helpers/adminHelper');
const { verifyGoogleToken } = require('../helpers/googleAuthHelper'); // Asegúrate de ajustar la ruta según tu estructura de directorios


// HANDLER CONTROLLER
const handleControllerError = (error, res) => {
    logger.error('controller error:', error);
    if (!(error instanceof ErrorHandler)) {
        error = new ErrorHandler(500, error.message || "Server error");
    }
    handleError(error, res);
};

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

// SEND PASSWORD RESET EMAIL
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

// GOOGLE METHOD
const authenticateWithGoogle = async (req, res) => {
    try {
        const { token } = req.body;
        const userInfo = await verifyGoogleToken(token); // Utiliza el helper para verificar el token

        // Verificar si el correo electrónico cumple con los criterios para ser administrador maestro
        const isAdminEmail = checkIfAdminEmail(userInfo.email); // Asume la existencia de esta función

        // Buscar si el usuario ya existe en la base de datos
        let user = await User.findOne({ googleId: userInfo.sub });

        // Verificar si ya existe un MasterAdministrator en caso de que el usuario sea un admin
        const masterAdminExists = isAdminEmail ? await User.exists({ role: 'MasterAdministrator' }) : false;

        if (!user) {
            // Determinar el rol del usuario
            const userRole = isAdminEmail && !masterAdminExists ? 'MasterAdministrator' : 'Registered';
            const userGroups = userRole === 'MasterAdministrator' ? ['Sales', 'Developers', 'Marketing', 'Managers', 'Customer'] : [];

            user = new User({
                googleId: userInfo.sub,
                emailAddress: userInfo.email,
                firstName: userInfo.given_name,
                lastName: userInfo.family_name || 'NoLastName',
                userName: generateUserName(userInfo.email), // Asume la existencia de esta función
                role: userRole,
                groups: userGroups,
                authMethod: 'google',
                profileImage: userInfo.picture,
                emailVerified: userInfo.email_verified,
                locale: userInfo.locale,
                Verification: userInfo.email_verified ? 'active' : 'notActivate',
            });

            await user.save();
        }
        const userToken = jwt.createToken(user);
        res.json({ user: user.toJSON(), token: userToken });

    } catch (error) {
        console.error("Error verifying Google token or user creation:", error);
        res.status(500).json({ error: "Internal server error", details: error.toString() });
    }
};

// SIGNUP MASTER ADMINISTRATOR LOCAL METHOD
const createMasterAdmin = async (req, res) => {
    try {
        const { error } = validateUser(req.body);
        if (error) {
            throw new ErrorHandler(400, error.details[0].message);
        }
        const { firstName, lastName, emailAddress, password, userName } = req.body;
        const masterAdminExists = await User.exists({ role: 'MasterAdministrator' });
        if (masterAdminExists) {
            throw new ErrorHandler(400, "A Master Administrator is already registered.");
        }

        // Si no existe un MasterAdministrator, procedemos a crear uno
        const userRole = 'MasterAdministrator'; // Esta constante se define aquí ya que se usa en la creación del usuario
        const userGroups = userRole === 'MasterAdministrator' ? ['Sales', 'Developers', 'Marketing', 'Managers', 'Customer'] : [];


        const masterAdmin = new User({
            userName,
            firstName,
            lastName,
            emailAddress,
            password,
            role: userRole,
            groups: userGroups,
        });
        const token = masterAdmin.generateConfigurationToken();
        await masterAdmin.save();
        const activationUrl = `http://localhost:4200/initial-config/activation/${token}`;
        const mailOptions = {
            from: 'tuemail@example.com',
            to: masterAdmin.emailAddress,
            subject: 'Verify your MasterAdministrator account',
            html: `<p>Please follow this <a href="${activationUrl}">link</a> to activate your account.</p>`,
        };
        try {
            await transporter.sendMail(mailOptions);
        } catch (mailError) {
            logger.error('Error sending email:', mailError);
            throw new ErrorHandler(500, "Error sending activation email.");
        }
        res.status(201).json(createSuccessfulResponse("MasterAdministrator created successfully. Please verify your email.", { masterAdminId: masterAdmin._id }));
    } catch (error) {
        logger.error('createMasterAdmin error:', error);
        handleControllerError(error, res);
    }
};

// ACTIVATE MASTER ADMINISTRATOR ACCOUNT
const activateMasterAdmin = async (req, res) => {
    try {
        const { token } = req.params;
        const masterAdmin = await User.findOne({
            configurationToken: token,
            configurationTokenExpires: { $gt: Date.now() }
        });
        if (!masterAdmin) {
            throw new ErrorHandler(400, "Invalid or expired token.");
        }
        if (masterAdmin.Verification === 'active') {
            throw new ErrorHandler(400, "This account has already been activated.");
        }
        masterAdmin.Verification = 'active';
        masterAdmin.configurationToken = undefined;
        masterAdmin.configurationTokenExpires = undefined;
        await masterAdmin.save();
        let confirmationEmailSent = true;
        const confirmationMailOptions = {
            from: 'tuemail@example.com',
            to: masterAdmin.emailAddress,
            subject: 'Account Activated',
            html: `<p>Your MasterAdministrator account has been successfully activated.</p>`,
        };
        try {
            await transporter.sendMail(confirmationMailOptions);
        } catch (mailError) {
            logger.error('Error sending confirmation email:', mailError);
            confirmationEmailSent = false;
        }
        res.status(200).json(createSuccessfulResponse("Account successfully activated", { confirmationEmailSent }));

    } catch (error) {
        logger.error('activateMasterAdmin error:', error);
        handleControllerError(error, res);
    }
};

// RESEND VERIFICATION EMAIL
const resendVerificationEmail = async (req, res) => {
    try {
        const { emailAddress } = req.body;
        // Validar que se ha proporcionado una dirección de correo electrónico
        if (!emailAddress) {
            throw new ErrorHandler(400, "Email address is required.");
        }
        // Buscar el usuario por dirección de correo electrónico
        const user = await User.findOne({ emailAddress, role: 'MasterAdministrator' });
        if (!user) {
            throw new ErrorHandler(404, "User not found.");
        }
        // Verificar si el usuario ya está verificado
        if (user.Verification === 'active') {
            throw new ErrorHandler(400, "This account has already been verified.");
        }
        // Generar un nuevo token de configuración
        const token = user.generateConfigurationToken();
        await user.save();
        // Preparar y enviar el correo electrónico de verificación
        const activationUrl = `${process.env.FRONTEND_URL}/auth/reset-password/${token}`;
        const mailOptions = {
            from: 'tuemail@example.com',
            to: user.emailAddress,
            subject: 'Verify your MasterAdministrator account',
            html: `<p>Please follow this <a href="${activationUrl}">link</a> to activate your account.</p>`,
        };

        try {
            await transporter.sendMail(mailOptions);
        } catch (mailError) {
            logger.error('Error sending email:', mailError);
            throw new ErrorHandler(500, "Error sending verification email.");
        }

        res.status(200).json(createSuccessfulResponse("Verification email resent successfully."));
    } catch (error) {
        logger.error('resendVerificationEmail error:', error);
        handleControllerError(error, res);
    }

};


// FORGOT PASSWORD
const forgotPassword = async (req, res) => {
    try {
        const { emailAddress } = req.body;
        if (!emailAddress) {
            return res.status(400).json({ message: "Email address is required." });
        }

        const user = await User.findOne({ emailAddress });
        if (!user) {
            // Por razones de seguridad, es mejor no revelar si el correo existe o no
            return res.status(200).json({ message: "If the email exists in our system, a password reset link will be sent." });
        }

        // Generar el token de restablecimiento de contraseña utilizando el método del modelo
        const resetToken = user.generatePasswordResetToken();
        await user.save(); // Guarda los cambios en el usuario, incluyendo el token y su expiración

        // Construir URL de restablecimiento de contraseña
        const resetPasswordUrl = `${process.env.FRONTEND_URL}/auth/reset-password/${resetToken}`;

        // Preparar y enviar el correo electrónico
        const mailOptions = {
            from: '"Nombre de tu Aplicación" <tuemail@example.com>',
            to: user.emailAddress,
            subject: 'Reset your user account password',
            html: `<p>Please follow this <a href="${resetPasswordUrl}">link</a> to reset your user account password.</p>`,
        };

        await transporter.sendMail(mailOptions);

        res.status(200).json({ message: "Password reset link sent to email if it exists in our system." });
    } catch (error) {
        console.error("Forgot password error:", error);
        res.status(500).json({ message: "Server error" });
    }
};


// RESET PASSWORD
const resetPassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body;

        if (!newPassword || newPassword.length < 8) {
            throw new ErrorHandler(400, "The new password must be at least 8 characters long.");
        }

        const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            throw new ErrorHandler(400, "Invalid or expired password reset token.");
        }

        user.password = newPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        res.status(200).json(createSuccessfulResponse("Your password has been updated successfully.", {}));
    } catch (error) {
        logger.error(error.message); // Registra el error utilizando Winston
        handleError(error, res); // Maneja el error y envía la respuesta al cliente
    }
};

module.exports = {
    loginUser,
    forgotPassword,
    resetPassword,
    authenticateWithGoogle,
    createMasterAdmin,
    activateMasterAdmin,
    resendVerificationEmail,
};