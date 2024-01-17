// middlewares/rateLimit.js
const rateLimit = require('express-rate-limit');

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 5, // límite de 5 solicitudes por ventana
    message: 'Demasiados intentos de inicio de sesión desde esta IP, intente nuevamente después de 15 minutos'
});

module.exports = {
    loginLimiter
};
