/*
contentControl

Florian Wokurka (2011)
Feel free to use.

*/

document.getElementById("zposi").addEventListener("change",function(e){
    document.getElementById("zposiOutput").firstChild.nodeValue = e.target.value;
    },false);

document.getElementById("detail").addEventListener("change",function(e){
    document.getElementById("detailOutput").firstChild.nodeValue = e.target.value;
    },false);

    
    