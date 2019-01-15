var nodes= document.getElementsByTagName("div");

for(let i=0; i < nodes.length; ++i) {
    let node = nodes[i];
    // ...
}

nodes.forEach((node)=>{ /*...*/ }); // TypeError: nodes.forEach is not a function