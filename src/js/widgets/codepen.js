(function () {
	function openCodepen(title, htmlCode, cssCode, jsCode) {
		const form = document.querySelector('form[action="https://codepen.io/pen/define"]');
		if (form) {
			form.querySelector('input[name=data]').setAttribute('value', JSON.stringify({
				title: title,
				html: htmlCode,
				css: cssCode,
				js: jsCode
			}));
			form.submit();
		}
	}

	function openCodepenNS(id) {
		const template = document.querySelector('template#' + id);

		if (!template) { return; }
        const cloneContent = document.importNode(template.content, true);

		const jsEls = cloneContent.querySelectorAll('script.codepen-js');
        const cssEls = cloneContent.querySelectorAll('style.codepen-css');

        let js = '', css = '', html = '';

        Array.from(jsEls).forEach(function (script) {
			js += script.innerHTML + '\n';
			cloneContent.removeChild(script);
        });
        Array.from(cssEls).forEach(function (style) {
            css += style.innerHTML + '\n';
            cloneContent.removeChild(style);
        });
        let contentWrap = document.createElement('div');
        contentWrap.appendChild(cloneContent.cloneNode(true));
        html += contentWrap.innerHTML;

		openCodepen('Example', html, css, js);
	}

	// Bind buttons
	let buttons = document.querySelectorAll('[data-codepen-id]');
	Array.from(buttons).forEach(function (button) {
		let id = button.getAttribute('data-codepen-id');
		if (id) {
			button.addEventListener('click', (e) => {
				openCodepenNS(id);
				e.stopPropagation();
				e.preventDefault();
            });
        }
    });
})();