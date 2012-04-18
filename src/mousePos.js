window.mousePosX = mousePosX;
window.mousePosY = mousePosY;


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