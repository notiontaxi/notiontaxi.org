/*
Main class

TODO:
make it faster (abort, when mouse is moved to fast)

Florian Wokurka (2011)
Feel free to use.

*/

 
window.CanvasManipulation = CanvasManipulation;


CanvasManipulation.prototype.start = function(){

	var thisObject = this;
	thisObject.render = true;
	thisObject.myVideo.play();
	thisObject.loop(thisObject);
	$('#content').hide().fadeIn(1000);	
							
}

CanvasManipulation.prototype.stop = function(){

	this.stopLoop = true;
	this.myVideo.pause();
	this.removeEventlisteners();

	var thisObject = this;
	$('#content').fadeOut(200, function(){
									delete($('#myVideo'));
									delete(thisObject.myVideo);
							});						
}

function CanvasManipulation(){
	var parent;
	var myCanvasDummy;
	var dummy;
	var myCanvases;
	var myCanvasContexts;
	var myVideo;
	var noWhite;
	var invert;
	var greyscale;
	var canvasWidth;
	var canvasHeight;
	var dummyWidth;
	var dummyHeight;
	var imageData;
	var stopLoop = false;

	this.init();
	this.addCanvases();
	this.addEventlisteners();

}

CanvasManipulation.prototype.loop = function(thisObject){
	
	// draw video on thisObject.dummy canvas
	thisObject.dummy.drawImage(thisObject.myVideo, 0,0,thisObject.myVideo.width, thisObject.myVideo.height);
	// grab pixel informations from thisObject.dummy canvas
	thisObject.imageData = thisObject.dummy.getImageData(0,0,thisObject.dummyWidth, thisObject.dummyHeight);

// modify the pixel informations

if(thisObject.noWhite){
	for (var i = 0; i < thisObject.imageData.data.length; i+=4) {
	  var r = thisObject.imageData.data[i + 0];
	  var g = thisObject.imageData.data[i + 1];
	  var b = thisObject.imageData.data[i + 2];
	  if (g > 200 && r > 200 && b > 200)
		thisObject.imageData.data[i + 3] = 0;
	}	
}	


//** thisObject.invert ********************************************************************************************
		if(thisObject.invert){
			for (var i = 0; i < thisObject.imageData.data.length; i+=4) {
				thisObject.imageData.data[i + 0] = 255 - thisObject.imageData.data[i + 0];
				thisObject.imageData.data[i + 1] = 255 - thisObject.imageData.data[i + 1];
				thisObject.imageData.data[i + 2] = 255 - thisObject.imageData.data[i + 2];
			}
		}
// *****************************************************************************************************
	
//** thisObject.greyscale *****************************************************************************************		
		if(thisObject.greyscale){
			for (var i = 0; i < thisObject.imageData.data.length; i+=4) {
				var r = thisObject.imageData.data[i + 0];
				var g = thisObject.imageData.data[i + 1];
				var b = thisObject.imageData.data[i + 2];
				// The effective luminance of a pixel:
				// 0.3*RED + 0.59*GREEN + 0.11*Blue (a little bit modificated for bit shift)
				var brightness = (5*r+8*g+b*3)>>>4; // Zero-Fill Right Shift
				thisObject.imageData.data[i + 0] = brightness;
				thisObject.imageData.data[i + 1] = brightness;
				thisObject.imageData.data[i + 2] = brightness;
			}	
		
		}	
// *****************************************************************************************************

	thisObject.dummy.putImageData(thisObject.imageData,0, 0);
   
// ** draw contents  *********************************************************************************************   
   var i = 0;
   
   for(var row = 0;row < 3; row++)
		for(var column = 0; column < 3;column++){
			var myInnerImageData = thisObject.dummy.getImageData(column*thisObject.canvasWidth,row*canvasHeight,thisObject.canvasWidth, canvasHeight);
			thisObject.myCanvasContexts[i].putImageData(myInnerImageData,0, 0);			
			i++;
		}
	
// ***************************************************************************************************************
	if(!thisObject.stopLoop)
		setTimeout(function(){thisObject.loop(thisObject)},25);

}


CanvasManipulation.prototype.init = function(){

	this.myCanvasDummy = document.getElementById("myCanvasDummy");
	this.dummy = this.myCanvasDummy.getContext("2d");

	
	document.getElementById("myCanvas");
	
	this.myVideo = document.getElementById("myVideo");
	
	this.dummyWidth = this.myVideo.width;
    this.dummyHeight = this.myVideo.height;
	
	this.canvasWidth = this.myVideo.width / 3;
	canvasHeight = this.myVideo.height/ 3 ;

	this.noWhite = document.getElementById("checkBoxNoBlack").checked;
	this.invert = document.getElementById("checkBoxInvert").checked;
	this.greyscale = document.getElementById("checkBoxGreyscale").checked;
	
	this.myVideo.pause();
	render = false;
}

CanvasManipulation.prototype.addCanvases = function(){

	this.myCanvases = new Array;
	this.myCanvasContexts = new Array;

	this.parent = document.getElementById("content");

	for(var i = 0; i < 9; i++){
	
		this.myCanvases[i] = document.createElement("canvas");
		this.myCanvasContexts[i] = this.myCanvases[i].getContext("2d");
		this.parent.appendChild(this.myCanvases[i]);
		
		// set attributes
		var name = document.createAttribute("id");
		name.nodeValue = "canvas"+i;
		this.myCanvases[i].setAttributeNode(name);
		
		var height= document.createAttribute("height");
		height.nodeValue = canvasHeight;		
		this.myCanvases[i].setAttributeNode(height);
		
		var width= document.createAttribute("width");
		width.nodeValue = this.canvasWidth;		
		this.myCanvases[i].setAttributeNode(width);				
		
		var pos= document.createAttribute("class");
		pos.nodeValue = "myCanvas";		 
		this.myCanvases[i].setAttributeNode(pos);	

		this.myCanvases[i].style.left = 450 + (i%3*this.canvasWidth) + "px";
		if(i<3)
			this.myCanvases[i].style.top  = 130+"px";
		else if(i >= 3 && i < 6)
			this.myCanvases[i].style.top  = 130 +  (canvasHeight) + "px";
		else
			this.myCanvases[i].style.top  = 130  + (canvasHeight<<1) + "px";

		// make 'em draggable
		new Draggable(this.myCanvases[i]);
	}
	
	this.myCanvases[8].style.top += 10+"px";
	this.myCanvases[8].style.left += 10+"px";
	
	
}


CanvasManipulation.prototype.rotate = function(element, angle){
	if (element.style.MozTransform !== undefined) {  
		element.style.MozTransform = 'rotate(' + angle + 'deg)';
	} else if (element.style.webkitTransform !== undefined) { 
		element.style.webkitTransform = 'rotate(' + angle + 'deg)';
	} else if (element.style.OTransform !== undefined) {   
		element.style.OTransform = 'rotate(' + angle + 'deg)';
	} else {
		element.style.transform = "rotate(" + angle + "deg)";
	}
}

CanvasManipulation.prototype.addEventlisteners = function(){
	var thisObject = this;

	$("#videoSize").bind("change",function(e){
		for(var i = 0; i < thisObject.myCanvases.length; i++)
			thisObject.rotate(thisObject.myCanvases[i], e.target.value);
	
    });

	$("#checkBoxNoBlack").bind("change",function(e){
		thisObject.noWhite = e.target.checked;
    }); 
		
	$("#checkBoxInvert").bind("change",function(e){
        thisObject.invert = e.target.checked;
    }); 
	
	$("#checkBoxGreyscale").bind("change",function(e){
        thisObject.greyscale = e.target.checked;
    }); 

	$(this.myVideo).bind('play', function(e){
		render = true;
	});
	
	$(this.myVideo).bind('pause', function(e){
		render = false;
	});

	$(this.myVideo).bind('ended', function(e){
		thisObject.myVideo.play();
	});	
	
	$("#videoSize").bind("change",function(e){
		document.getElementById("videoSizeOutput").firstChild.nodeValue = e.target.value;
    });
	
	console.log("added event listeners");
}

CanvasManipulation.prototype.removeEventlisteners = function(){
	
	$("#videoSize").unbind('change');
	$("#checkBoxNoBlack").unbind('change'); 	
	$("#checkBoxInvert").unbind('change'); 
	$("#checkBoxGreyscale").unbind('change'); 
	$("#videoSize").unbind('change');

	$(this.myVideo).unbind('play');
	$(this.myVideo).unbind('pause');
	$(this.myVideo).unbind('ended');	
	
	console.log("removed event listeners");
}


