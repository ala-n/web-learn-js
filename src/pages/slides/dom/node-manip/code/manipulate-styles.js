const MAX = parseInt('fff', 16);
function randomize() {
    let el = document.querySelector('.content');

    let randomColor = Math.floor(Math.random() * MAX);
    let bgColor = '#' + Number(randomColor).toString(16);
    let fgColor = '#' + Number(MAX - randomColor).toString(16);

    el.style.backgroundColor = bgColor;
    el.style.color = fgColor;
}