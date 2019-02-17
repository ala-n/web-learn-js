const fs = require('fs');
const path = require('path');

const basepath = path.join(__dirname, '../src/codepens/');

function readFile(file) {
    return new Promise((resolve) => {
       fs.exists(file, (exists) => {
           if (exists) {
               fs.readFile(file, (err, data) => {
                   resolve((data || "").toString().trim());
               });
           } else {
               resolve(null);
           }
       });
    });
}
function getData(penPath) {
    if (!penPath) return Promise.reject(new Error('No path specified'));

    const targetDir = path.join(basepath, penPath);
    return Promise.all([
        readFile(path.join(targetDir, 'code.html')),
        readFile(path.join(targetDir, 'code.css')),
        readFile(path.join(targetDir, 'code.js'))
    ]).then( (parts) => {
        if (!parts[0] && !parts[1] && !parts[2]) {
            throw new Error(`Pen '${penPath}' not found.`);
        }
        return {
            title: penPath,
            html: parts[0] || '',
            css: parts[1] || '',
            js: parts[2] || ''
        }
    });
}

function sanitize(data) {
    return JSON.stringify(data)
        .replace(/"/g, '&quot;');
}
function buildRedirectForm(data) {
    return `<html>
                <head><title>Codepen Redirect</title></head>
                <body>
                    <form method="post" action="https://codepen.io/pen/define">
                        <input type="hidden" name="data" value="${sanitize(data)}">
                    </form>
                    <script>document.querySelector('form').submit()</script>
                </body>
            </html>`;
}

module.exports = {
    handle: function(request, response) {
        const penPath = request.url.split('pen/')[1];
        getData(penPath).then((data) => {
            response.end(buildRedirectForm(data));
        }, (err) => {
            response.statusCode = 404;
            response.statusMessage = err.toString();
            response.end();
        });
    }
};