// helpers/logHelper.js
const winston = require('winston');

// Configura el logger de winston
const logger = winston.createLogger({
    level: 'info', // Nivel de registro predeterminado
    format: winston.format.json(),
    transports: [
        new winston.transports.File({ filename: 'error.log', level: 'error' }), // Registro de errores en 'error.log'
        new winston.transports.File({ filename: 'combined.log' }), // Registro combinado en 'combined.log'
    ],
});

module.exports = logger;
