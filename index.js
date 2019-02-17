const http = require('http');
const Static = require('node-static');
const CodepenHandler = require('./server/codepen-handler.js');

// Options
const PORT = process.env.PORT || 5000;
const USE_GZIP = String(process.env.GZIP) !== 'false';
const MAIN_CACHE = parseVar(process.env.MAIN_CACHE) || 2 * 3600;
const ASSETS_CACHE = parseVar(process.env.ASSTETS_CACHE) || 24 * 3600;

function parseVar(v) {
    if (!isNaN(+v)) return v;
    if (String(v) === 'false') return false;
    if (String(v) === 'true') return true;
    return v;
}

// Static Server Instances
const assets = new Static.Server('./assets', {
    cache: ASSETS_CACHE
});
const publish = new Static.Server('./publish', {
    gzip: USE_GZIP,
    cache: MAIN_CACHE
});

const server = http.createServer((request, response) => {
    if (request.url.startsWith('/pen/')) {
        CodepenHandler.handle(request, response);
        return;
    }
    request.on('end', function () {
        const result = publish.serve(request, response);
        result.on('error', () => assets.serve(request, response));
    }).resume();
});

console.log('========= Starting Server =========');
console.log(`- Gzip:         ${USE_GZIP ? 'enabled' : 'disabled'}`);
console.log(`- Main Cache:   ${MAIN_CACHE / 3600}h `);
console.log(`- Assets Cache: ${ASSETS_CACHE / 3600}h `);
console.log('-----------------------------------');

server.listen(PORT);
console.log(`Server started on port ${PORT}`);
console.log('===================================');