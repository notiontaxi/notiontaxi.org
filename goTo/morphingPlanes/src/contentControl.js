/*
contentControl

Florian Wokurka (2011)
Feel free to use.

*/

document.getElementById("duration").addEventListener("change",function(e){
    document.getElementById("durationOutput").firstChild.nodeValue = e.target.value;
    },false);


    
    