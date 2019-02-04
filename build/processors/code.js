const hljs = require('highlight.js');

hljs.configure({
    classPrefix: 'code-'
});

function fixTabs(text, tabIndent = 4) {
    let indent = '';
    while (tabIndent-- > 0) {
        indent += ' ';
    }
    return text.replace(/\t/g, indent);
}

function count(text, symbols) {
    let count = 0;
    symbols = [].concat(symbols);
    while (count < text.length && symbols.indexOf(text[count]) !== -1) count++;
    return count;
}

function cleanIndents(inpText) {
    let text = fixTabs(inpText, 2);
    let lines = text.split('\r\n');
    let indent = Number.MAX_SAFE_INTEGER;

    while (lines.length > 0 && lines[0].trim().length === 0) {
        lines.shift();
    }
    while (lines.length > 0 && lines[lines.length - 1].trim().length === 0) {
        lines.pop();
    }

    for (let line of lines) {
        indent = Math.min(indent, count(line, [' ', '\t']));
    }

    const regex = new RegExp('^(\\s{' + String(indent) + '})');

    return lines.map((line) => {
        return line.replace(regex, '');
    }).join('\n');
}

module.exports = {
    tag: 'include-code',
    parse: function (context, utils) {
        let text = context.content;
        if (context.args.src) {
            const path = utils.path.join(context.currentDirectory, context.args.src);
            text = utils.getFileContent(path);
        }
        const lang = context.args.lang;

        const cleanText = cleanIndents(text);
        const hResult = hljs.highlightAuto(cleanText, typeof lang === 'string' ? [lang] : ['javascript', 'html']);
        const code = hResult.value.replace(/!##/ig, '<strong>').replace(/##!/ig, '</strong>');

        return `<pre class="code ${hResult.language}"><code>${code}</code></pre>`;
    }
};