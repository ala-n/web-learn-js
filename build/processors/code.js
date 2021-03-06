const Prism = require('prismjs');
const loadLanguages = require('prismjs/components/');
loadLanguages(['markup', 'javascript', 'css', 'typescript', 'less']);

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
    let lines = text.replace(/\r/g, '').split('\n');
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

    console.log(`[HTML <include-code> plugin]: removed ${indent} indents for "${(inpText || '').trim().substr(0, 20)}..."`);

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
        const lang = context.args.lang || 'html';

        const cleanText = cleanIndents(text);

        const prismFormated = Prism.highlight(cleanText, Prism.languages[lang], lang);

        const code = prismFormated.replace(/!##/ig, '<strong>').replace(/##!/ig, '</strong>');

        return `<pre class="code ${context.args.class || ''}"><code class="language-${lang}">${code}</code></pre>`;
    }
};