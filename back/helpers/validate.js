// helpers/validate.js
const Joi = require('joi');

const validateUser = (data) => {
    const schema = Joi.object({
        userName: Joi.string()
            .alphanum()
            .min(5)
            .max(20)
            .required(),
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        organizationName: Joi.string(),
        countryAddress: Joi.string().required(),
        stateAddress: Joi.string().required(),
        emailAddress: Joi.string()
            .email()
            .required(),
        password: Joi.string()
            .min(6) // Asumiendo un mínimo de 6 caracteres como requisito de seguridad
            .required(),
        phoneNumber: Joi.string(),
        birthday: Joi.date(),
        role: Joi.string()
            .valid('MasterAdministrator', 'Administrator', 'Registered', 'Editor', 'Guest')
            .required(),
        groups: Joi.array()
            .items(Joi.string()
                .valid('Sales', 'Developers', 'Marketing', 'Managers', 'Customer')),
        identification: Joi.string(),
        additionalInfo: Joi.string(),
        profileImage: Joi.string(),
        // Si hay campos adicionales que aceptas, inclúyelos aquí
    });

    return schema.validate(data);
};

module.exports = {
    validateUser
};
