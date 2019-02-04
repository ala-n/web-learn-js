'use strict';

const fs = require('fs');
const path = require('path');
const through = require('through2');
const PluginError = require('plugin-error');

const PLUGIN_NAME = 'gulp:html-processor';

const TAG_PROCESSORS = [
    require('./processors/import'),
    require('./processors/code')
];

function process(initialContent, currentDirectory) {
    let content = initialContent;
    const utils = {
        path,
        process,
        getFileContent
    };
    TAG_PROCESSORS.forEach((processor) => {
        const tag = processor.tag;
        const regex = new RegExp(`<${tag} (.*?)>([\\s\\S]*?)<\\/${tag}>`, 'gim');
        content = content.replace(
          regex,
          function (term, argString, content) {
              const args = parseAttributes(argString);
              return processor.parse({
                  tag,
                  term,
                  args,
                  content,
                  currentDirectory
              }, utils);
          }
        );
    });
    return content;
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

/**
* GULP PLUGIN ROOT
* */
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
            const content = file.contents.toString();
            file.contents = new Buffer(process(content, dir));
            this.push(file);
        } catch (err) {
            this.emit('error', new PluginError(PLUGIN_NAME, err));
        }
        cb();
    });
};
