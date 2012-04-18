/* Florian Wokurka (2011)
 * 
 * Feel free to use.
 * 
 * Special thanks to Jan Monschke 4 answering my b00n-questions ;)  
 * Thanks to http://css3-html5.de/ for information and motivation :)
 * */
 

window.Particles2D = Particles2D;
"use strict";

function Particles2D(){
	$("#content").css('height', 510);
	var myCanvas;
	var myCanvasContext;

	var canvasWidth;
	var canvasHeight;

	var quadArray;
	var maxParticles;
	var grow;

	var render;

	var particleHeight;
	var particleWidth;

	var gravity;
	var friction;
	var bouncy;
	console.log("constructor");
	this.init();						
	this.addEventListeners();		 
}

Particles2D.prototype.start = function(){
	$('#content').hide().fadeIn(1000);
	this.render = true;
	this.loop();
}

Particles2D.prototype.stop = function(){
var thisObject = this;
	$('#content').stop().fadeOut(800, function(){
		thisObject.render = false;
	});
}




Particles2D.prototype.loop = function(){


	// overpaint the canvas
	this.myCanvasContext.fillStyle = "rgba(0,0,0,0.1)";
	this.myCanvasContext.fillRect(0,0,this.canvasWidth,this.canvasHeight);
	
	var thisObject = this;
	// rule for the next call
	if(!this.render){
		setTimeout(function(){thisObject.loop();}, 250);
		return;
	}else
		setTimeout(function(){thisObject.loop();}, 25);
	
	
	// paint every particle in the array
	for(var index in this.quadArray){
		this.myCanvasContext.fillStyle = "#009900"; //this.quadArray[index].color;
		this.myCanvasContext.fillRect(this.quadArray[index].xPosition,    this.quadArray[index].yPosition,    this.quadArray[index].width,   this.quadArray[index].height);
		this.quadArray[index].newPosition(this.bouncy, this.friction, this.gravity);
	}

	
	// add "this.grow" particles to the array until it has reached the size of this.maxParticles
	if(this.quadArray.length < this.maxParticles){
		for(var i = 0; i < this.grow; i++ )
			this.quadArray[this.quadArray.length] = new ParticleFor2D(this.particleWidth, this.particleHeight, this.canvasWidth, this.canvasHeight); // variable array :)
	}
	// -> call the first time 
	
	
	// remove "this.grow" particles to the array until it has reached the size of this.maxParticles
	else if(this.quadArray.length > this.maxParticles){
		for(var i = 0; i < this.grow; i++ )  // same time for removing as for adding
			if(this.quadArray.length > this.maxParticles) // but dont remove more than wanted!
				 this.quadArray.pop();// = remove Particle(); // variable array :)
	}
}


Particles2D.prototype.impulse = function(){
	for(var i in this.quadArray)
		this.quadArray[i].impulse();	
};


Particles2D.prototype.init = function(){
		console.log("init start");
	if(!this.myCanvas){ // execute only one time!
	console.log("executed");
	this.myCanvas = document.getElementById("myCanvas");
	this.myCanvasContext = this.myCanvas.getContext("2d");

	this.canvasWidth = this.myCanvas.width;
	this.canvasHeight = this.myCanvas.height;
	}

	this.quadArray = new Array();
	this.maxParticles = document.getElementById("partMaxNumOutput").firstChild.nodeValue;
	this.grow = document.getElementById("PartIncreaseOutput").firstChild.nodeValue;
	
	this.render = false;
	
	this.particleHeight = document.getElementById("partHeight").value;
	this.particleWidth  = document.getElementById("partWidth").value;	
	
	this.gravity = document.getElementById("checkBoxGravity").checked;
	this.friction = document.getElementById("checkBoxFriction").checked;
	this.bouncy = document.getElementById("partBouncingOutput").firstChild.nodeValue;
		console.log("init end");
}



Particles2D.prototype.addEventListeners = function(){

	var thisObject = this;

	document.getElementById("PartMaxNum").addEventListener("change",function(e) {
		thisObject.maxParticles = parseInt(e.target.value);
	},false);

	document.getElementById("PartIncrease").addEventListener("change",function(e) {
		thisObject.grow = parseInt(e.target.value);
	},false);

	document.getElementById("PartBouncing").addEventListener("change",function(e) {
		thisObject.bouncy = document.getElementById("partBouncingOutput").firstChild.nodeValue;
	},false);

	document.getElementById("partHeight").addEventListener("change",function(e) {
		var newHeight = parseInt(e.target.value);
		for(i in thisObject.quadArray){
			thisObject.quadArray[i].height = newHeight;
		}
		thisObject.particleHeight =  newHeight;
	},false);

	document.getElementById("partWidth").addEventListener("change",function(e) {
		var newWidth = parseInt(e.target.value);
		for(i in thisObject.quadArray){
			thisObject.quadArray[i].width = newWidth;
		}
		thisObject.particleWidth = newWidth;
	},false);

	document.getElementById("checkBoxGravity").addEventListener("change",function(e) {
		thisObject.gravity = !thisObject.gravity;
	},false);

	document.getElementById("checkBoxFriction").addEventListener("change",function(e) {
		thisObject.friction = !thisObject.friction;
	},false);

	document.getElementById("btnImpulse").addEventListener("click",function() {
		thisObject.impulse();
	},false);

	document.getElementById("btnPause").addEventListener("click",function() {
		thisObject.render = !thisObject.render;
	},false);

	document.getElementById("btnReset").addEventListener("click",function() {
		thisObject.init();
		thisObject.render = true;
	},false);
	
	document.getElementById("PartMaxNum").addEventListener("change",function(e){
		document.getElementById("partMaxNumOutput").firstChild.nodeValue = e.target.value;
		},false);

	document.getElementById("PartIncrease").addEventListener("change",function(e){
		document.getElementById("PartIncreaseOutput").firstChild.nodeValue = e.target.value;
		},false);

	document.getElementById("PartBouncing").addEventListener("change",function(e){
			document.getElementById("partBouncingOutput").firstChild.nodeValue = parseFloat(e.target.value).toFixed(1);
		},false);
		
	document.getElementById("partHeight").addEventListener("change",function(e){
			document.getElementById("partHeightOutput").firstChild.nodeValue = e.target.value;
		},false);
		
	document.getElementById("partWidth").addEventListener("change",function(e){
			document.getElementById("partWidthOutput").firstChild.nodeValue = e.target.value;
		},false);   		

}


