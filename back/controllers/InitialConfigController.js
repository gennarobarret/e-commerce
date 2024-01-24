// initialCofigController.js

const User = require("../models/userModel");
const { ErrorHandler, handleError } = require("../helpers/errorHandler");
const { createSuccessfulResponse } = require("../helpers/responseHelper");
const { validateUser } = require("../helpers/validate");
const logger = require('../helpers/logHelper');
const transporter = require('../helpers/mailHelper');
const bcrypt = require("bcrypt");
const handleControllerError = (error, res) => {
    logger.error('controller error:', error);
    if (!(error instanceof ErrorHandler)) {
        error = new ErrorHandler(500, error.message || "Server error");
    }

    handleError(error, res);
};


// INITIAL CHECK
const InitialCheck = async (req, res) => {
    try {
        const masterAdmin = await User.findOne({ role: 'MasterAdministrator' });
        let setupRequired = false;
        let verificationRequired = false;
        let message = "";

        if (!masterAdmin) {
            message = "No MasterAdmin found, ready for initial setup";
            setupRequired = true;
        } else if (masterAdmin.Verification !== 'active') {
            message = "MasterAdmin is not verified";
            verificationRequired = true;
        } else {
            message = "Master Administrator is already verified, ready for login";
        }

        res.status(200).json(createSuccessfulResponse(message, { setupRequired, verificationRequired }));
    } catch (error) {
        handleControllerError(error, res);
    }
};


const createMasterAdmin = async (req, res) => {
    try {
        // Validar datos de entrada
        const { error } = validateUser(req.body);
        if (error) {
            throw new ErrorHandler(400, error.details[0].message);
        }
        const { masterAdminName, firstName, lastName, emailAddress, password, ...otherFields } = req.body;

        const masterAdminExists = await User.exists({ role: 'MasterAdministrator' });
        if (masterAdminExists) {
            throw new ErrorHandler(400, "A Master Administrator is already registered.");
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const masterAdmin = new User({
            masterAdminName,
            firstName,
            lastName,
            emailAddress,
            password: hashedPassword,
            role: 'MasterAdministrator',
            ...otherFields
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

const activateMasterAdmin = async (req, res) => {
    try {
        const { token } = req.body;
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

module.exports = {
    InitialCheck,
    createMasterAdmin,
    activateMasterAdmin
};

// // CREATE MASTER ADMIN
// const createMasterAdmin = async (req, res) => {
//     try {
//         const masterAdminExists = await User.exists({ role: 'MasterAdministrator' });
//         if (masterAdminExists) {
//             throw new ErrorHandler(400, "MasterAdmin already exists. Initial setup already completed.");
//         }

//         const validation = validateUser(req.body);
//         if (validation.error) {
//             throw new ErrorHandler(400, validation.error.details.map(detail => detail.message).join(", "));
//         }

//         const masterAdmin = new User({ ...req.body, role: 'MasterAdministrator' });
//         await masterAdmin.save();

//         res.status(200).json(createSuccessfulResponse("MasterAdmin created successfully", { masterAdmin: masterAdmin }));
//     } catch (error) {
//         handleControllerError(error, res);
//     }
// };

// CREATE MASTER ADMIN
// const createMasterAdmin = async (req, res) => {
//     try {
//         const masterAdminExists = await User.exists({ role: 'MasterAdministrator' });
//         if (masterAdminExists) {
//             throw new ErrorHandler(400, "MasterAdmin already exists. Initial setup already completed.");
//         }

//         const validation = validateUser(req.body);
//         if (validation.error) {
//             throw new ErrorHandler(400, validation.error.details.map(detail => detail.message).join(", "));
//         }

//         const masterAdmin = new User({ ...req.body, role: 'MasterAdministrator' });
//         const token = masterAdmin.generateConfigurationToken();
//         await masterAdmin.save();

//         // Preparar y enviar correo electrónico
//         const mailOptions = {
//             from: 'tuemail@example.com',
//             to: masterAdmin.emailAddress,
//             subject: 'Configuración de Cuenta de MasterAdministrator',
//             text: `Por favor, usa el siguiente token para configurar tu cuenta: ${token}`,
//             // ... puedes añadir HTML al correo si lo deseas ...
//         };

//         transporter.sendMail(mailOptions, function (error, info) {
//             if (error) {
//                 console.error(error);
//                 return res.status(500).send('Error al enviar el correo electrónico.');
//             } else {
//                 console.log('Correo enviado: ' + info.response);
//                 return res.status(200).send('Correo de configuración enviado.');
//             }
//         });

//     } catch (error) {
//         handleControllerError(error, res);
//     }
// };
