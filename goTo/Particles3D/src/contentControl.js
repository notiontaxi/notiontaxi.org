/* Florian Wokurka (2011)
 *
 * Feel free to use.
 * */
 
document.getElementById("PartMaxNum").addEventListener("change",function(e){
    document.getElementById("partMaxNumOutput").firstChild.nodeValue = e.target.value;
    },false);

document.getElementById("PartIncrease").addEventListener("change",function(e){
    document.getElementById("PartIncreaseOutput").firstChild.nodeValue = e.target.value;
    },false);

document.getElementById("PartBouncing").addEventListener("change",function(e){
        document.getElementById("partBouncingOutput").firstChild.nodeValue = parseFloat(e.target.value).toFixed(1);
    },false);
    
document.getElementById("partRadius").addEventListener("change",function(e){
        document.getElementById("partRadiusOutput").firstChild.nodeValue = e.target.value;
    },false);
    
document.getElementById("partDetail").addEventListener("change",function(e){
        document.getElementById("partDetailOutput").firstChild.nodeValue = e.target.value;
    },false);    

   
    
    