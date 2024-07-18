import http from 'http';
import path from 'path';
import debugFunc from 'debug';
import fs from 'fs/promises';
import app from '../app.mjs';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { PORT } from '../constants/env.mjs';
import { unlink } from 'node:fs/promises';

const __dirname =
    import.meta.dirname || dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..', '..');
const debug = debugFunc(`${root}:server`);
/**
 * Get port from environment and store in Express.
 */

const port = normalizePort(PORT || '3000');
app.set('port', port);

/**
 * Create HTTP server.
 */

const server = http.createServer(app);

const cleanupImage = async () => {
    const res = await fs.readdir(path.join(__dirname, '..', 'temp', 'images'));

    res.map(async (fileName) => {
        const filePath = `${path.join(__dirname, '..', 'temp', 'images')}/${fileName}`;
        console.log(filePath);
        await unlink(filePath);
    });
};

// add so the process does not end immediately
process.stdin.resume();
/**
 *  remove the uploaded image when the server closed
 */
[`exit`, `SIGINT`, `SIGUSR1`, `SIGUSR2`, `uncaughtException`, `SIGTERM`].map(
    (eventType) => {
        process.on(eventType, async () => {
            console.log(eventType)
            await cleanupImage();

            process.exit(0);
        });
    }
);
/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
    const port = parseInt(val, 10);

    if (Number.isNaN(port)) {
        // named pipe
        return val;
    }

    if (port >= 0) {
        // port number
        return port;
    }

    return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    const bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
    const addr = server.address();
    const bind =
        typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
    debug('Listening on ' + bind);
}
