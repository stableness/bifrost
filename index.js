// @ts-check

import { connect } from 'net';
import { createServer } from 'http';
import { readFileSync } from 'fs';
import { pipeline } from 'stream';





const {
    PORT: port = '80',
    AUTH: auth = 'auth.json',
} = process.env;




export function run () {

    return createServer()

        .listen({ port: +port, host: '0.0.0.0' }, function () {
            console.log('http', this.address().port);
        })

        .addListener('connect', onConnect)

        .addListener('request', (_request, response) => {
            response.writeHead(204).end();
        })

    ;

}

/**
 * @param { import('http').IncomingMessage } request
 * @param { import('net').Socket } socket
 */
function onConnect ({ url, headers }, socket) {

    if (authBy(headers) === false) {
        return socket.once('error', noop).end(reply);
    }

    const newURL = readURL(url);

    if (newURL == null) {
        return socket.once('error', noop).end();
    }

    const { hostname: host } = newURL;
    const port = portNormalize(newURL);

    const conn = connect({ port, host, allowHalfOpen: true }, () => {
        socket.write('HTTP/1.0 200\r\n\r\n');
    });

    pipeline(socket, conn, socket, _err => {
    });

}





const authStore = new Set(Object
    .entries(readAuth(auth))
    .map(([ username, password ]) => username + ':' + password)
    .map(auth => 'Basic ' + Buffer.from(auth).toString('base64'))
);

/**
 * @param { import('http').IncomingHttpHeaders } headers
 */
function authBy (headers) {

    if (authStore.size < 1) {
        return true;
    }

    return authStore.has(headers['proxy-authorization']);

}






const reply = [
    'HTTP/1.1 407 Proxy Authentication Required',
    'Proxy-Authenticate: Basic realm="proxy auth please"',
].join('\r\n') + '\r\n\r\n';





function noop () {
}





function portNormalize ({ port, protocol }) {
    return +port || (protocol === 'http:' ? 80 : 443);
}





/**
 * @param { string } file
 */
function readAuth (file) {

    try {
        return JSON.parse(readFileSync(file, { encoding: 'utf8' }));
    } catch {
        return {};
    }

}





/**
 * @param { string } path
 */
function readURL (path) {

    try {
        return new URL(`http://${ path }`);
    } catch {
        return undefined;
    }

}

