var nodes= document.getElementsByTagName("div");
Array.prototype.forEach.call(nodes, (node)=>{ /*...*/ });

var nodesArray = Array.prototype.slice.call(nodes); // convert NodeList to Array
nodesArray.forEach((node)=>{ /*...*/ });
var someNodes = nodesArray.filter((node)=>{ /*...*/ });