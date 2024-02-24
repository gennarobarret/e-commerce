// helpers/validate.js
const Joi = require('joi');

const validateUser = (data) => {
    const schema = Joi.object({
        userName: Joi.string()
            .alphanum()
            .min(5)
            .max(20)
            .trim()
            .messages({
                'string.pattern.base': 'must only contain alpha-numeric characters'
            })
            .required(),
        firstName: Joi.string().trim().required(),
        lastName: Joi.string().trim().required(),
        organizationName: Joi.string().trim(),
        countryAddress: Joi.string().trim(),
        stateAddress: Joi.string().trim(),
        emailAddress: Joi.string()
            .email()
            .lowercase()
            .trim()
            .required(),
        password: Joi.string()
            .pattern(new RegExp('^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$'))
            .messages({
                'string.pattern.base': 'Password must be at least 8 characters, including numbers, uppercase, lowercase, and special characters.'
            })
            .required(),
        phoneNumber: Joi.string().trim(),
        birthday: Joi.date(),
        role: Joi.string()
            .valid('MasterAdministrator', 'Administrator', 'Registered', 'Editor', 'Guest')
            .required(),
        groups: Joi.array()
            .items(Joi.string()
                .valid('Sales', 'Developers', 'Marketing', 'Managers', 'Customer')),
        identification: Joi.string().trim(),
        additionalInfo: Joi.string().trim(),
        profileImage: Joi.string().trim(),
        loginAttempts: Joi.number(),
        lockUntil: Joi.number()
    });

    return schema.validate(data, { abortEarly: false });
};

const validateLogin = (data) => {
    const schema = Joi.object({
        userName: Joi.string()
            .alphanum()
            .min(1)
            .max(20)
            .trim()
            .required(),
        password: Joi.string()
            .trim()
            .required()
    });

    return schema.validate(data, { abortEarly: false });
};

module.exports = {
    validateUser,
    validateLogin
};
