(function(publicScope) {
    'use strict';

    // Caching template
    const template = document.getElementById('note-template');
    // Caching container
    const container = document.getElementById('notes');

    function addItem (data) {
        // Create a new node using template,
        // passing content and deepCopy marker
        let newNote = document.importNode(template.content, true);

        // Here is one of variants how to make
        // clone node filling more generic
        // NOTE: optimize it more if you want to use approach like that

        // Get all marked placeholders inside new item
        let placeholders = newNote.querySelectorAll('[data-target]');
        // Going through them
        [].forEach.call(placeholders || [], (phElement) => {
            // Get placeholder attribute value
            let key = phElement.getAttribute('data-target');
            // Using it as a key to get value from data object
            phElement.textContent = String(data[key]); // Data type cast
        });

        // Append node
        container.appendChild(newNote);
    }


    // Initial filling
    [
        {content: 'First Message', date: new Date()},
        {content: 'Second Message', date: 'No date'}
    ].forEach((item) => addItem(item));

    // An example of runtime usage
    publicScope.onAddItem = () => {
        var content =
            document.querySelector('#addItemForm [name="content"]');
        addItem({
            content: content.value, date: new Date()
        });
    }
})(window);