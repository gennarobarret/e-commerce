require('dotenv').config();
// Importaciones necesarias
const { OAuth2Client } = require('google-auth-library');

// Inicializa el cliente de OAuth2 con tu Google Client ID
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Función para verificar el token de Google
async function verifyGoogleToken(token) {
    try {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID, // Asegúrate de que esto coincida con tu Client ID de Google Cloud
        });
        return ticket.getPayload(); // Retorna el payload del token verificado
    } catch (error) {
        console.error("Error al verificar el token de Google:", error);
        throw error; // Relanza el error para manejarlo más arriba en la cadena
    }
}

module.exports = { verifyGoogleToken };
