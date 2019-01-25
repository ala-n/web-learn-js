/**
 * Element.closest polyfill
 * */
(function (e) {
    // @ts-ignore
    e.matches = e.matches || e.msMatchesSelector || e.mozMatchesSelector || e.webkitMatchesSelector;
    e.closest = e.closest || function (css: string) {
        let node = this;
        while (node) {
            if (node.matches(css)) return node;
            node = node.parentElement;
        }
        return null;
    };
})(Element.prototype);