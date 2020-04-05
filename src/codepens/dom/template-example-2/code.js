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

        // fill note data
        fillItemData(newNote, data);

        // Append node
        container.appendChild(newNote);
    }

    // Here is one of variants how to make
    // clone node filling more generic
    // NOTE: optimize it more if you want to use approach like that
    function fillItemData(item, data) {
        // Get all marked placeholders (elements marked by data-target attribute)
        let placeholders = item.querySelectorAll('[data-target]');
        // Going through them
        [].forEach.call(placeholders || [], (phElement) => {
            // Get placeholder attribute value
            let key = phElement.getAttribute('data-target');
            // Using it as a key to get value from data object
            phElement.textContent = String(data[key]); // Data type cast
        });
    }


    // Initial content
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