function manip() {
    var container = document.querySelector('div.container');

    var stub = container.querySelector('.empty-stub');
    stub && container.removeChild(stub);

    var row = document.createElement('div');
    row.textContent = (new Date()).toString();

    container.appendChild(row);
}