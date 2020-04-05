const MAX = parseInt('fff', 16);
function randomize() {
    let el = document.querySelector('.content');

    let randomColor = Math.floor(Math.random() * MAX); // Random 3-digit HEX number
    let bgColor = '#' + Number(randomColor).toString(16); // e.g. #000
    let fgColor = '#' + Number(MAX - randomColor).toString(16); // e.g. #fff

    el.style.backgroundColor = bgColor;
    el.style.color = fgColor;
}