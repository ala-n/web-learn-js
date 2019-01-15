// Just an example! There are many options exists.
var Service = (function () {
    var a = 'I\'m a private variable';

    // Public API
    return {
        getA: ()=>a
    };
})();