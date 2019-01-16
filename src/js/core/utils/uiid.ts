export function* simpleSequence(start = 1) {
    let index = start;
    while (start < Number.MAX_SAFE_INTEGER) {
        yield (index++);
    }
}

function rand32() {
    return Math.floor(Math.random() * Number.MAX_SAFE_INTEGER).toString(31);
}
function time32() {
    return Date.now().toString(31);
}

export function uiid() {
    return `${rand32()}-${rand32()}-${rand32()}-${time32()}`;
}