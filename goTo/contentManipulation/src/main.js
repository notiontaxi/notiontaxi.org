/*
main class

Florian Wokurka (2011)
Feel free to use.

*/

 
(function () {
var initWidth;
var initHeight;

var isPlaying;
var myCanvas;
var myCanvasContext;
var myVideo;
var filter;
var invert;
var greyscale;
var filterRanges;
var choosenColor;



window.onload = start;

function start(){
init();
addEventlisteners();
loop();
}


// here happens the magic
function loop(){

	if(!render){
		setTimeout(loop,250);
	}else{

	// draw the video onto the canvas             
	myCanvasContext.drawImage(myVideo,0,0,myCanvas.width,myCanvas.height);
	// grab the pixel informations from the canvas 
	var imageData = myCanvasContext.getImageData(0,0,myCanvas.width,myCanvas.width);

	// 4informations for each pixel (red, green, blue, alpha)
	
// modify the pixel informations
//** invert ********************************************************************************************
		if(invert){
			for (var i = 0; i < imageData.data.length; i+=4) {
				imageData.data[i + 0] = 255 - imageData.data[i + 0];
				imageData.data[i + 1] = 255 - imageData.data[i + 1];
				imageData.data[i + 2] = 255 - imageData.data[i + 2];
			}
		}
// *****************************************************************************************************
	
//** greyscale *****************************************************************************************		
		if(greyscale){
			for (var i = 0; i < imageData.data.length; i+=4) {
				var r = imageData.data[i + 0];
				var g = imageData.data[i + 1];
				var b = imageData.data[i + 2];
				// The effective luminance of a pixel:
				// 0.3*RED + 0.59*GREEN + 0.11*Blue (a little bit modificated for bit shift)
				var brightness = (5*r+8*g+b*3)>>>4; // Zero-Fill Right Shift
				imageData.data[i + 0] = brightness;
				imageData.data[i + 1] = brightness;
				imageData.data[i + 2] = brightness;
			}	
		
		}	
// *****************************************************************************************************
	
//** remove black **************************************************************************************
		if(filter){
			for (var i = 0; i < imageData.data.length; i+=4) {
				var r = imageData.data[i + 0];
				var g = imageData.data[i + 1];
				var b = imageData.data[i + 2];
				// filter color
				if (r >= filterRanges[0] && r <= filterRanges[1]&&
				    g >= filterRanges[2] && g <= filterRanges[3]&&
					b >= filterRanges[4] && b <= filterRanges[5])
					imageData.data[i + 3] = 0;
				// filter similar colors (2 steps)
				if (r >= filterRanges[1] && r <= filterRanges[1] +10 &&
				    g >= filterRanges[3] && g <= filterRanges[3] +10&&
					b >= filterRanges[5] && b <= filterRanges[5] +10)
					imageData.data[i + 3] = 160;
				if (r >= filterRanges[0] -10 && r < filterRanges[0] &&
				    g >= filterRanges[2] -10 && g < filterRanges[2] &&
					b >= filterRanges[4] -10 && b < filterRanges[4])
					imageData.data[i + 3] = 160;	
				if (r >= filterRanges[1] +10 && r <= filterRanges[1] +20 &&
				    g >= filterRanges[3] +10 && g <= filterRanges[3] +20 &&
					b >= filterRanges[5] +10 && b <= filterRanges[5] +20)
					imageData.data[i + 3] = 220;
				if (r >= filterRanges[0] -20 && r < filterRanges[0] -10 &&
				    g >= filterRanges[2] -20 && g < filterRanges[2] -10 &&
					b >= filterRanges[4] -20 && b < filterRanges[4] -10)
					imageData.data[i + 3] = 220;	
			}	
			
		}	
// *****************************************************************************************************

	// write the modified pixels back to the canvas
	myCanvasContext.putImageData(imageData,0,0);

	// set the loop rule
	setTimeout(loop,25);

	}
}


function init(){


	if(!myCanvas){ // execute only one time! (when the program starts)
	
		document.getElementById("content").style.height = "320px";
		document.getElementById("content").style.paddingTop = "50px";
	
		myCanvas = document.getElementById("myCanvas");
		myCanvasContext = myCanvas.getContext("2d");
		myVideo = document.getElementById("myVideo");
		
		initWidth = 480;
		initHeight = 270;
		
		myVideo.width = initWidth;
		myVideo.height = initHeight;
		
		myCanvas.width = initWidth;
		myCanvas.height = initHeight;
	}
	// set flags
	filter = document.getElementById("checkBoxNoBlack").checked;
	invert = document.getElementById("checkBoxInvert").checked;
	greyscale = document.getElementById("checkBoxGreyscale").checked;
	render = !myVideo.paused;
	
	// filter settings
	myFilterColor = new FilterColor(0,0,0,20);
	filterRanges = myFilterColor.getMinMaxValues();
	
	
}

function mousePosX(e) {
	var posx = 23;
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
	var posy = 23;
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

function getColorOfCanvasPixel(e_x, e_y){
    var imageData = myCanvasContext.getImageData(0,0,myCanvas.width,myCanvas.height);
    var pixels = imageData.data;  
	// imageData.width * 4 == one y position
    var pixelRedIndex = ((e_y) * (imageData.width * 4)) + ((e_x) * 4);  
    return new Array(pixels[pixelRedIndex],pixels[pixelRedIndex+1],pixels[pixelRedIndex+2]);
}


function addEventlisteners(){

	// resize video and canvas
	document.getElementById("videoSize").addEventListener("change",function(e){
		var myVideo = document.getElementById("myVideo");
		var myCanvas = document.getElementById("myCanvas");
		
		aspect = initWidth/initHeight;
		var width = e.target.value;
		var height = width / aspect;
		var side = String((initWidth - width)/2) + 'px';
		var top = String((initHeight - height)/2) + 'px';
		
		myVideo.width = width;
		myVideo.height = height;
		myVideo.style.paddingTop= top;
		myVideo.style.paddingLeft = side;
		
		myCanvas.width = width;
		myCanvas.height = height;
		console.log(myCanvas.style.paddingBottom);
		myCanvas.style.paddingTop= top;
		myCanvas.style.paddingRight = side;	
		
	},false);

	document.getElementById("myCanvas").addEventListener("mouseup",function(e){
			//calc PaddingTop
			var offsetTop = e.target.offsetTop + (initHeight - e.target.offsetHeight);
			//console.log("X: " + (mousePosX(e)- e.target.offsetLeft) + " Y:" + ( mousePosY(e) - offsetTop) + " OffsetTop: "+offsetTop + " OffsetLeft: "+e.target.offsetLeft);
			choosenColor = getColorOfCanvasPixel(Math.floor(mousePosX(e)- e.target.offsetLeft), Math.floor(mousePosY(e) - offsetTop));
			myFilterColor.setRGBValues(choosenColor[0],choosenColor[1],choosenColor[2]);
			filterRanges = myFilterColor.getMinMaxValues();
		},false); 	
	
		// change filter range
	document.getElementById("filterRange").addEventListener("change",function(e){
		myFilterColor.setFilterRange(Math.floor(e.target.value));
		filterRanges = myFilterColor.getMinMaxValues();
		
	},false); 	
	
	// set flags
	document.getElementById("checkBoxNoBlack").addEventListener("change",function(e){
			filter = e.target.checked;
		},false); 
			
	document.getElementById("checkBoxInvert").addEventListener("change",function(e){
			invert = e.target.checked;
		},false); 
		
	document.getElementById("checkBoxGreyscale").addEventListener("change",function(e){
			greyscale = e.target.checked;
		},false);

	document.getElementById("checkBoxRender").addEventListener("change",function(e){
			render = e.target.checked;
		},false); 		

	myVideo.addEventListener('play', function(e){
		render = true;
		document.getElementById("checkBoxRender").checked = true;
	}, false);
		
	myVideo.addEventListener('pause', function(e){
		render = false;
		document.getElementById("checkBoxRender").checked = false;
	}, false);


}

})();
