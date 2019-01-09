import {html, render} from 'lit-html';
import DialogPolyfill from './dialog-polyfill';

(function () {
    const template = (questions) =>
        html`<div class="questions-list">
            ${questions.map((question) => html`
                <fieldset class="box-white question-item" data-question-id="${question.id}">
                    <legend>${question.text}</legend>
                    ${question.code ? html`<pre class="question-code">${question.code}</pre>` : ''}
                    ${question.answers.map((value) => html`
                    <div class="question-answer">
                        <label><input type="${question.type || 'checkbox'}" name="${question.id}" value="${value}"/> ${value}</label>
                    </div>
                    `)}
                </fieldset>
            `)}
            <div class="dlg-toolbar">
                <button type="submit">Проверить</button>
                <button type="button" onclick="endTest()">Закрыть</button>      
            </div>    
         </div>`;

    function loadForm(form, path) {
        fetch(path + '.json')
            .then((res) => res.json())
            .then((data) => {
                if (data.questions && data.questions.length) {
                    const questions = data.questions.map((question, number) => {
	                    question.id = `q-${number+1}`;
                        return question;
                    });

                    render(template(questions), form);

                    form._validateObject = questions.reduce((objValidate, item) => {
                        objValidate[item.id] = item.right;
                        return objValidate;
                    } ,{});
                }
            });
    }

    function equals(v1, v2) {
        if (v1 && v1.length === 1) { v1 = v1[0] }
	    if (v2 && v2.length === 1) { v2 = v2[0] }
        if (Array.isArray(v1) || Array.isArray(v2)) {
            if (v1.length === v2.length) {
                return !(v1.some((key) => v2.indexOf(key) === -1));
            }
            return false;
        } else {
            return String(v1) === String(v2);
        }
    }

    function checkForm(env, event) {
        if (env.form._validateObject) {
            const formData = new FormData(env.form);
            Object.keys(env.form._validateObject).forEach((key)=> {
                let item = env.form.querySelector('[data-question-id="'+key+'"]');

                if (equals(env.form._validateObject[key], formData.getAll(key))) {
                    item.classList.remove('wrong');
                    item.classList.add('right');
                } else {
                    item.classList.add('wrong');
                    item.classList.remove('right');
                }
            });
        }
        event.preventDefault();
        event.stopPropagation();
    }

    let testState;
    window.endTest = function () {
        if (testState) {
            testState.dialog.close();
            testState = null;
        }
    };
    window.openTest = function openTest(path) {
        window.endTest();
        if (path) {
            const dialog = document.getElementById('test-dialog');
            // Polyfill
            DialogPolyfill.registerDialog(dialog);

            const form = document.getElementById('test-form');

            loadForm(form, path);
            testState = {
                form,
                dialog,
                path
            };

            dialog.showModal();

            form.onsubmit = checkForm.bind(null, testState);
        }
    }
})();