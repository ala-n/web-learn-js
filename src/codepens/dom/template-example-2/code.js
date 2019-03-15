// Get the template element from our markup
const TEMPLATE = document.getElementById('item-template');

/**
 * That function will create item HTML element from model
 */
function buildItem(item) {
    // Getting a copy of template markup (it's prepared and ready HTMLElements)
    // Just only one moment template tag can contains multiple child tags
    // so the result of import will be DocumentFragment
    const fragment = document.importNode(
        TEMPLATE.content, // Put our templae content
        true // Deep copy enabled
    );
    // We got DocumentFragment our next steps to simplify work is
    // just get a single root element that we need
    const newItem = fragment.firstElementChild;

    // Now we can do anyting we want with the root element
    newItem.classList.add('bg-' + item.bg);

    // And we can access all elements inside to update content to the real data
    newItem.querySelector('.item-text').textContent = item.text;

    return newItem;
}


// An example of usage:

const container = document.getElementById('content');

[
    {text: 'Test 1', bg: 'red'},
    {text: 'Test 2', bg: 'green'}
]
    .map(buildItem) // Creates HTML elements from model items
    .forEach((itm) => container.appendChild(itm)); // Ae add them to container to see

// An example of catching events from buttons since we have them in markup
container.addEventListener('click', onDelete);
function onDelete (event) { // Listener
    if (event.target && event.target.classList.contains('btn-delete')) { // Dlegtion
        container.removeChild(event.target.closest('.item')); // Here can be the method call
    }
}