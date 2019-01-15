var nodes= document.getElementsByTagName("div");
Array.prototype.forEach.call(nodes, (node)=>{ /*...*/ });

var nodesArray = Array.prototype.slice.call(nodes); // convert NodeList to Array
nodesArray.forEach((node)=>{ /*...*/ });

var nodesArray = Array.from(nodes); // Same in ES6 style
nodesArray.forEach((node)=>{ /*...*/ });