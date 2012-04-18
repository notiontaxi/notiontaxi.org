/*
contentControl

Florian Wokurka (2011)
Feel free to use.

*/

document.getElementById("filterRange").addEventListener("change",function(e){
	document.getElementById("filterRangeOutput").firstChild.nodeValue = e.target.value;
},false); 	

document.getElementById("videoSize").addEventListener("change",function(e){
	document.getElementById("videoSizeOutput").firstChild.nodeValue = e.target.value;
},false);