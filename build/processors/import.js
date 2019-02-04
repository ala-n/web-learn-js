module.exports = {
    tag: 'include',
    parse: function processImportTag(context, utils) {
        const src = context.args.src;
        const dir = context.currentDirectory;
        if (!src) throw new Error('src is required for <include> tag');

        const filePath = utils.path.join(dir, src);
        const fileContent = utils.getFileContent(filePath);
        const fileDir = utils.path.dirname(filePath);

        return utils.process(fileContent, fileDir);
    }
};