'use strict';
const fs = require('fs');
const path = require('path');
const through = require('through2');
const PluginError = require('plugin-error');

//const beutyfy = require('js-beautify');
const hljs = require('highlight.js');

hljs.configure({
    classPrefix: 'code-'
});

const PLUGIN_NAME = 'gulp:html-processor';

const PROCESSORS = [includeTag];
module.exports = function () {
    return through.obj(function (file, enc, cb) {
        if (file.isNull()) {
            cb(null, file);
            return;
        }

        if (file.isStream()) {
            cb(new PluginError(PLUGIN_NAME, 'Streaming not supported'));
            return;
        }

        const dir = path.dirname(file.path);

        try {
            let content = file.contents.toString();

            PROCESSORS.forEach((p) => {
               content = p(content, dir);
            });

            file.contents = new Buffer(content);
            this.push(file);
        } catch (err) {
            this.emit('error', new PluginError(PLUGIN_NAME, err));
        }

        cb();
    });
};

const INCLUDE_TAG_REG = /<include .*?><\/include>/gi;
function includeTag(content, dir) {
    return content.replace(INCLUDE_TAG_REG, (tag) => {
        const attributes = parseAttributes(tag);

        if (!attributes.src) throw new Error('src is required for <include> tag');

        const filePath = path.join(dir, attributes.src);

        let result = getFileContent(filePath);

        if (attributes.code) {
            const hResult = hljs.highlightAuto(result, typeof attributes.code === 'string' ? [attributes.code] : ['javascript', 'html']);
            const code = hResult.value.replace(/!##/ig, '<strong>').replace(/##!/ig, '</strong>');
            result = `<pre class="code ${hResult.language}"><code>${code}</code></pre>`;
        }

        if (INCLUDE_TAG_REG.test(result)) {
            return includeTag(result, path.dirname(filePath));
        } else {
            return result;
        }
    });
}

function parseAttributes(tag) {
    let res;
    const regexp = /([\w-]+)(\s?=\s?"([^"]*)"?)?/gi;
    const attributes = {};

    while (!!(res = regexp.exec(tag))) {
        const key = res[1];
        const value = res[3];
        attributes[key] = (value === undefined) ? true : value;
    }

    return attributes;
}

function getFileContent(filePath) {
    return fs.readFileSync(filePath).toString();
}
