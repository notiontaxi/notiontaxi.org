/*
class ContentManipulation

Florian Wokurka (2011)
Feel free to use.

*/
 
window.ContentManipulation = ContentManipulation; 
"use strict";

function ContentManipulation(){
	$("#content").css('height', 320);
	$('#myInnerVideo').hide();
	var initWidth;
	var initHeight;

	var myCanvas;
	var myCanvasContext;
	var myVideo;
	var filter;
	var invert;
	var greyscale;
	var filterRanges;
	var choosenColor;
	var render;
	var myFilterColor;
	var aspect;

	this.waitForVideo();
}

ContentManipulation.prototype.start = function(){
	this.myVideo.play();
	$('#myInnerVideo').show();
	$('#content').hide().fadeIn(1000);
	
	this.render = true;
}

ContentManipulation.prototype.stop = function(){
var thisObject = this;
	$('#content').stop().fadeOut(800, function(){
		thisObject.myVideo.pause();
		thisObject.render = false;
	});
}

ContentManipulation.prototype.waitForVideo = function(){
	
	var thisObject = this;
	
	this.myVideo = ($("#myInnerVideo"))[0];
	this.myVideo.pause();
	this.render = false;
	
	if (!(this.myVideo.readyState === this.myVideo.HAVE_ENOUGH_DATA)){
		setTimeout(function(){thisObject.waitForVideo();},50);
	}else{
		this.init();
		this.addEventlisteners();
		this.loop();
	}

}

// here happens the magic
ContentManipulation.prototype.loop = function(){

	var thisObject= this;

	if(!this.render){
		setTimeout(function(){thisObject.loop();},250);
	}else{

	// draw the video onto the canvas             
	this.myCanvasContext.drawImage(this.myVideo,0,0,this.myCanvas.width,this.myCanvas.height);
	// grab the pixel informations from the canvas 
	var imageData = this.myCanvasContext.getImageData(0,0,this.myCanvas.width,this.myCanvas.width);

	// 4informations for each pixel (red, green, blue, alpha)
	
// modify the pixel informations
//** this.invert ********************************************************************************************
		if(this.invert){
			for (var i = 0; i < imageData.data.length; i+=4) {
				imageData.data[i + 0] = 255 - imageData.data[i + 0];
				imageData.data[i + 1] = 255 - imageData.data[i + 1];
				imageData.data[i + 2] = 255 - imageData.data[i + 2];
			}
		}
// *****************************************************************************************************
	
//** this.greyscale *****************************************************************************************		
		if(this.greyscale){
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
		if(this.filter){
			for (var i = 0; i < imageData.data.length; i+=4) {
				var r = imageData.data[i + 0];
				var g = imageData.data[i + 1];
				var b = imageData.data[i + 2];
				// this.filter color
				if (r >= this.filterRanges[0] && r <= this.filterRanges[1]&&
				    g >= this.filterRanges[2] && g <= this.filterRanges[3]&&
					b >= this.filterRanges[4] && b <= this.filterRanges[5])
					imageData.data[i + 3] = 0;
				// this.filter similar colors (2 steps)
				if (r >= this.filterRanges[1] && r <= this.filterRanges[1] +10 &&
				    g >= this.filterRanges[3] && g <= this.filterRanges[3] +10&&
					b >= this.filterRanges[5] && b <= this.filterRanges[5] +10)
					imageData.data[i + 3] = 160;
				if (r >= this.filterRanges[0] -10 && r < this.filterRanges[0] &&
				    g >= this.filterRanges[2] -10 && g < this.filterRanges[2] &&
					b >= this.filterRanges[4] -10 && b < this.filterRanges[4])
					imageData.data[i + 3] = 160;	
				if (r >= this.filterRanges[1] +10 && r <= this.filterRanges[1] +20 &&
				    g >= this.filterRanges[3] +10 && g <= this.filterRanges[3] +20 &&
					b >= this.filterRanges[5] +10 && b <= this.filterRanges[5] +20)
					imageData.data[i + 3] = 220;
				if (r >= this.filterRanges[0] -20 && r < this.filterRanges[0] -10 &&
				    g >= this.filterRanges[2] -20 && g < this.filterRanges[2] -10 &&
					b >= this.filterRanges[4] -20 && b < this.filterRanges[4] -10)
					imageData.data[i + 3] = 220;	
			}	
			
		}	
// *****************************************************************************************************

	// write the modified pixels back to the canvas
	this.myCanvasContext.putImageData(imageData,0,0);

	// set the loop rule
	setTimeout(function(){thisObject.loop();},25);

	}
}


ContentManipulation.prototype.init = function(){


	if(!this.myCanvas){ // execute only one time! (when the program starts)
	
		$("#content").css("paddingTop", 50);
	
		this.myCanvas = ($("#myCanvas"))[0];
		this.myCanvasContext = this.myCanvas.getContext("2d");
		
		this.initWidth = 480;
		this.initHeight = 270;
		
		this.myVideo.width = this.initWidth;
		this.myVideo.height = this.initHeight;
		
		this.myCanvas.width = this.initWidth;
		this.myCanvas.height = this.initHeight;
	}
	// set flags
	this.filter = $('#checkBoxNoBlack:checked').val();
	this.invert = $('#checkBoxInvert:checked').val();
	this.greyscale = $('#checkBoxGreyscale:checked').val();
	this.render = false;
	
	// this.filter settings
	this.myFilterColor = new FilterColor(0,0,0,20);
	this.filterRanges = this.myFilterColor.getMinMaxValues();
	
	
}


ContentManipulation.prototype.getColorOfCanvasPixel = function(e_x, e_y){
    var imageData = this.myCanvasContext.getImageData(0,0,this.myCanvas.width,this.myCanvas.height);
    var pixels = imageData.data;  
	// imageData.width * 4 == one y position
    var pixelRedIndex = ((e_y) * (imageData.width * 4)) + ((e_x) * 4);  
    return new Array(pixels[pixelRedIndex],pixels[pixelRedIndex+1],pixels[pixelRedIndex+2]);
}


ContentManipulation.prototype.addEventlisteners = function(){

	var thisObject = this;

	// resize video and canvas
	$("#videoSize").bind("change",function(e){
		var myVideo = $("#myInnerVideo");
		var myCanvas = $("#myCanvas");
		
		thisObject.aspect = thisObject.initWidth/thisObject.initHeight;
		var width = e.target.value;
		var height = width / thisObject.aspect;
		var side = String((thisObject.initWidth - width)/2) + 'px';
		var top = String((thisObject.initHeight - height)/2) + 'px';
		
		thisObject.myVideo.width = width;
		thisObject.myVideo.height = height;
		thisObject.myVideo.style.paddingTop = top;
		thisObject.myVideo.style.paddingLeft = side;
		
		thisObject.myCanvas.width = width;
		thisObject.myCanvas.height = height;

		thisObject.myCanvas.style.paddingTop = top;
		thisObject.myCanvas.style.paddingRight = side;	
		
	});

	$("#myCanvas").bind("mouseup",function(e){
			//calc PaddingTop
			var offsetTop = e.target.offsetTop + (thisObject.initHeight - e.target.offsetHeight);

			thisObject.choosenColor = thisObject.getColorOfCanvasPixel(Math.floor(window.mousePosX(e)- e.target.offsetLeft), Math.floor(window.mousePosY(e) - offsetTop));
			thisObject.myFilterColor.setRGBValues(thisObject.choosenColor[0],thisObject.choosenColor[1],thisObject.choosenColor[2]);
			thisObject.filterRanges = thisObject.myFilterColor.getMinMaxValues();
		}); 	
	
		// change filter range
	$("#filterRange").bind("change",function(e){
		thisObject.myFilterColor.setFilterRange(Math.floor(e.target.value));
		thisObject.filterRanges = thisObject.myFilterColor.getMinMaxValues();
		
	}); 	
	
	// set flags
	$("#checkBoxNoBlack").bind("change",function(e){
			thisObject.filter = e.target.checked;
		}); 
			
	$("#checkBoxInvert").bind("change",function(e){
			thisObject.invert = e.target.checked;
		}); 
		
	$("#checkBoxGreyscale").bind("change",function(e){
			thisObject.greyscale = e.target.checked;
		});

	$("#checkBoxRender").bind("change",function(e){
			thisObject.render = e.target.checked;
		}); 		

	$(this.myVideo).bind('play', function(e){
		thisObject.render = true;
		$("#checkBoxRender").checked = true;
	});
		
	$(this.myVideo).bind('pause', function(e){
		thisObject.render = false;
		$("#checkBoxRender").checked = false;
	});


}


