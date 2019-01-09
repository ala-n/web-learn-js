const http = require('http');
const Static = require('node-static');

const assets = new Static.Server('./assets', {gzip: false, cache: 7200});
const pubish = new Static.Server('./publish', {gzip: true, cache: 7200});

const server = http.createServer((request, response) => {
    request.addListener('end', function () {
        const result = pubish.serve(request, response);
        result.on('error', () => assets.serve(request, response));
    }).resume();
});

const PORT = process.env.PORT || 5000;

server.listen(PORT);
console.log('Server started on port ' + PORT);