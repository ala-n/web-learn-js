var nodes= document.getElementsByTagName("div");
var nodesArray = Array.from(nodes); // convert NodeList to Array
nodesArray.forEach((node)=>{ /*...*/ });

var nodesArray = [...nodes]; // NodeList also can be "spreaded" as it's iterable
nodesArray.forEach((node)=>{ /*...*/ });
