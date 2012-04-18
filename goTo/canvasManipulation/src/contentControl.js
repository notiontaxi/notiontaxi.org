/*
contentControl

TODO:
make it faster (abort, when mouse is moved to fast)

Florian Wokurka (2011)
Feel free to use.

*/

document.getElementById("videoSize").addEventListener("change",function(e){
    document.getElementById("videoSizeOutput").firstChild.nodeValue = e.target.value;
    },false);
 
