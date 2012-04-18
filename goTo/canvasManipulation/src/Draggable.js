/*
Draggable

TODO:
make it faster (abort, when mouse is moved to fast)

Florian Wokurka (2011)
Feel free to use.

*/


(function () {

window.Draggable = Draggable;

function Draggable(e_element){

this.htmlElement;
this.drag = false;

if(e_element){
	this.htmlElement = e_element;
	this.addEventListeners();
}
else
	console.log(e_elementID+ " does not exist!");	
}


function mousePosX(e) {
	var posx = 99;
	// for IE
	if(e == null)
        var e = window.event;
        
	if (e.pageX) 	{
		posx = e.pageX;
	}
	// for IE
	else if (e.clientX) 	{
		posx = e.clientX + document.body.scrollLeft
			+ document.documentElement.scrollLeft;
	}
    return posx;
}
  
function mousePosY(e) {
	var posy = 200;
	// for IE
    if(e == null)
        var e = window.event;
        
	if (e.pageY) 	{
		posy = e.pageY;
	}
	// for IE
	else if (e.clientY) 	{
		posy = e.clientY + document.body.scrollTop
			+ document.documentElement.scrollTop;
	}
    return posy;
}


function updatePosition(event) {
	event.target.style.left = (mousePosX(event) - (event.target.width>>1)) + "px";
	event.target.style.top  = (mousePosY(event) - (event.target.height>>1)) + "px";
}



Draggable.prototype.addEventListeners = function(){
	this.htmlElement.addEventListener('mousedown', function(e){
		this.drag = true;
		e.target.style.zIndex= 2;
	}, false);
	
	this.htmlElement.addEventListener('mouseup', function(e){
		this.drag = false;
		e.target.style.zIndex= 1;
	}, false);
	
		this.htmlElement.addEventListener('mouseover', function(e){
		this.drag = false;
		e.target.style.zIndex= 1;
	}, true);
	
	this.htmlElement.addEventListener('mouseout', function(e){
		e.target.style.zIndex= 1;
	}, true);	

	this.htmlElement.addEventListener('mousemove', function(e){
		if(this.drag)
			updatePosition(e)
	}, false);
	


}


})();