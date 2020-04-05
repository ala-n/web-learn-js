var nodes= document.getElementsByTagName("div");

for(let i=0; i < nodes.length; ++i) {
    let node = nodes[i];
    // ...
}

var someNodes = nodes.filter((node)=>{ /*...*/ }); // TypeError: nodes.filter is not a function