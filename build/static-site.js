const fs = require('fs');
const path = require('path');
const CONSTANTS = require('./paths-config.json');

const ROOT_DIR = path.join(__dirname, '../');
const OUTPUT_DIR = path.join(ROOT_DIR, CONSTANTS.OUTPUT_DIR);
const ASSETS_DIR = path.join(ROOT_DIR, CONSTANTS.ASSETS_DIR);
const CODEPENS_DIR = path.join(ROOT_DIR, CONSTANTS.BUNDLE_DIR, 'codepens');
const CODE_FILES = ['code.html', 'code.css', 'code.js'];

function ensureDir(dirPath) {
    if (!dirPath || fs.existsSync(dirPath)) return;
    ensureDir(path.dirname(dirPath));
    fs.mkdirSync(dirPath);
}

function copyDir(sourceDir, targetDir) {
    if (!fs.existsSync(sourceDir)) return;
    ensureDir(targetDir);

    fs.readdirSync(sourceDir).forEach((entry) => {
        const sourcePath = path.join(sourceDir, entry);
        const targetPath = path.join(targetDir, entry);
        const stat = fs.statSync(sourcePath);

        if (stat.isDirectory()) {
            copyDir(sourcePath, targetPath);
            return;
        }

        fs.copyFileSync(sourcePath, targetPath);
    });
}

function readOptionalFile(filePath) {
    if (!fs.existsSync(filePath)) return null;
    return fs.readFileSync(filePath, 'utf8').trim();
}

function findPens(dirPath, relativePath, result) {
    if (!fs.existsSync(dirPath)) return result;

    const entries = fs.readdirSync(dirPath);
    const hasCodeFile = CODE_FILES.some((fileName) => entries.indexOf(fileName) >= 0);

    if (hasCodeFile && relativePath) {
        result.push(relativePath);
    }

    entries.forEach((entry) => {
        const nextAbsolutePath = path.join(dirPath, entry);
        if (!fs.statSync(nextAbsolutePath).isDirectory()) return;

        const nextRelativePath = relativePath ? path.join(relativePath, entry) : entry;
        findPens(nextAbsolutePath, nextRelativePath, result);
    });

    return result;
}

function sanitize(data) {
    return JSON.stringify(data).replace(/"/g, '&quot;');
}

function buildRedirectPage(data) {
    return `<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${data.title} - CodePen</title>
</head>
<body>
    <form method="post" action="https://codepen.io/pen/define">
        <input type="hidden" name="data" value="${sanitize(data)}">
        <noscript>
            <p>JavaScript отключён. Нажмите кнопку, чтобы открыть пример в CodePen.</p>
            <button type="submit">Open in CodePen</button>
        </noscript>
    </form>
    <script>document.querySelector('form').submit();</script>
</body>
</html>`;
}

function writePenPage(relativePath) {
    const sourceDir = path.join(CODEPENS_DIR, relativePath);
    const targetDir = path.join(OUTPUT_DIR, 'pen', relativePath);
    const targetFile = path.join(targetDir, 'index.html');
    const data = {
        title: relativePath.replace(/\\/g, '/'),
        html: readOptionalFile(path.join(sourceDir, 'code.html')) || '',
        css: readOptionalFile(path.join(sourceDir, 'code.css')) || '',
        js: readOptionalFile(path.join(sourceDir, 'code.js')) || ''
    };

    ensureDir(targetDir);
    fs.writeFileSync(targetFile, buildRedirectPage(data));
}

function createCodepenPages() {
    const pens = findPens(CODEPENS_DIR, '', []);
    pens.forEach(writePenPage);
}

function writeNoJekyll() {
    fs.writeFileSync(path.join(OUTPUT_DIR, '.nojekyll'), '');
}

function buildStaticSite() {
    ensureDir(OUTPUT_DIR);
    copyDir(ASSETS_DIR, OUTPUT_DIR);
    createCodepenPages();
    writeNoJekyll();
}

module.exports = {
    buildStaticSite
};

