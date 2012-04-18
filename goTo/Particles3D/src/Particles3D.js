/* Florian Wokurka (2011)
 * 
 * Feel free to use.
 * 
 * Special thanks to Jan Monschke 4 answering my b00n-questions ;)  
 * Thanks to http://css3-html5.de/ for information and motivation :)
 * */
 
window.Particles3D = Particles3D; 
"use strict";


function Particles3D(){
	$("#content").css('height', 510);
	var canvasWidth;
	var canvasHeight;
	var worldDepth;
	var myCanvas;

	var renderer;
	var camera;
	var scene;


	var numberOfQuads;
	var quadArray;
	var maxParticles;
	var grow;
	var gravity;
	var render;

	var radius;
	var detail;

	var friction;
	var perfectBouncing;
	var bouncy;

	var reset;

	this.addEventListeners();
	this.init();
	this.addLines();
}

Particles3D.prototype.start = function(){
	$('#content').hide().fadeIn(1000);
	this.render = true;
	this.loop();
}

Particles3D.prototype.stop = function(){
var thisObject = this;
	$('#content').stop().fadeOut(800, function(){
		thisObject.render = false;
	});
}

Particles3D.prototype.loop = function(){
	
	var thisObject = this;
	
	if(!this.render)
		setTimeout(function(){thisObject.nothing();},250);
	else
		setTimeout(function(){thisObject.loop();},25);

	// paint every particle in the array
	for(var index in this.quadArray){
		this.quadArray[index].newPosition(this.bouncy, this.friction, this.gravity);
	}


	// paint every particle in the array
	this.renderer.render(this.scene, this.camera); 

	// add "this.grow" particles to the array until it has reached the size of this.maxParticles
	if(this.quadArray.length < this.maxParticles){
		for(var i = 0; i < this.grow; i++ ){
			if(this.quadArray.length < this.maxParticles){
				this.quadArray[this.quadArray.length] = new ParticleFor3D(this.radius, this.detail, this.detail, this.canvasWidth, this.canvasHeight, this.worldDepth);
				this.scene.add(this.quadArray[this.quadArray.length-1]);
			}
	   }
	}
	// remove "this.grow" particles to the array until it has reached the size of this.maxParticles
	else if(this.quadArray.length > this.maxParticles){
		for(var i = 0; i < this.grow; i++ )  // same time for removing as for adding
			if(this.quadArray.length > this.maxParticles){ // but dont remove more than wanted!
				 this.scene.remove(this.quadArray[this.quadArray.length-1]);
				 this.quadArray.pop();// = remove ParticleFor3D(); // variable array :)
			}
	}

}

Particles3D.prototype.nothing = function(){

	var thisObject = this;

	if(!this.render)
		setTimeout(function(){thisObject.nothing();},250);
	else
		setTimeout(function(){thisObject.loop();},25);
}

Particles3D.prototype.impulse = function(){
	for(var i in this.quadArray)
		this.quadArray[i].impulse();	
};

Particles3D.prototype.addLines = function(){

	var halfCanvasWidth  = this.canvasWidth  >> 1;
	var halfCanvasheight = this.canvasHeight >> 1;

	var material = new THREE.LineBasicMaterial( { color: 0xffffff, opacity: 0.5 } );

	var geometry1 = new THREE.Geometry();
	var geometry2 = new THREE.Geometry();
	var geometry3 = new THREE.Geometry();
	var geometry4 = new THREE.Geometry();
	var geometry5 = new THREE.Geometry();
	var geometry6 = new THREE.Geometry();

	geometry1.vertices = new Array (( new THREE.Vertex( new THREE.Vector3(-halfCanvasWidth, halfCanvasheight, 0))), 
								   (  new THREE.Vertex( new THREE.Vector3(-halfCanvasWidth,-halfCanvasheight, 0))),
								   (  new THREE.Vertex( new THREE.Vector3( halfCanvasWidth,-halfCanvasheight, 0))),
								   (  new THREE.Vertex( new THREE.Vector3( halfCanvasWidth, halfCanvasheight, 0))),
								   ( new THREE.Vertex( new THREE.Vector3(-halfCanvasWidth, halfCanvasheight,  0)))
								  );
	geometry2.vertices = new Array (( new THREE.Vertex( new THREE.Vector3(-halfCanvasWidth, halfCanvasheight, -halfCanvasWidth))), 
								   (  new THREE.Vertex( new THREE.Vector3(-halfCanvasWidth,-halfCanvasheight, -halfCanvasWidth))),
								   (  new THREE.Vertex( new THREE.Vector3( halfCanvasWidth,-halfCanvasheight, -halfCanvasWidth))),
								   (  new THREE.Vertex( new THREE.Vector3( halfCanvasWidth, halfCanvasheight, -halfCanvasWidth))),
								   (  new THREE.Vertex( new THREE.Vector3(-halfCanvasWidth, halfCanvasheight, -halfCanvasWidth)))
								  );	
	geometry3.vertices = new Array (( new THREE.Vertex( new THREE.Vector3(-halfCanvasWidth, halfCanvasheight,    0))), 
									( new THREE.Vertex( new THREE.Vector3(-halfCanvasWidth, halfCanvasheight, -halfCanvasWidth)))
								   );
	geometry4.vertices = new Array (( new THREE.Vertex( new THREE.Vector3(-halfCanvasWidth,-halfCanvasheight,    0))), 
									( new THREE.Vertex( new THREE.Vector3(-halfCanvasWidth,-halfCanvasheight, -halfCanvasWidth)))
								   );
	geometry5.vertices = new Array (( new THREE.Vertex( new THREE.Vector3( halfCanvasWidth,-halfCanvasheight,    0))), 
									( new THREE.Vertex( new THREE.Vector3( halfCanvasWidth,-halfCanvasheight, -halfCanvasWidth)))
								   );
	geometry6.vertices = new Array (( new THREE.Vertex( new THREE.Vector3( halfCanvasWidth, halfCanvasheight,    0))), 
									( new THREE.Vertex( new THREE.Vector3( halfCanvasWidth, halfCanvasheight, -halfCanvasWidth)))
								   );							  
								  
								  
	var line1 = new THREE.Line( geometry1, material );
	var line2 = new THREE.Line( geometry2, material );
	var line3 = new THREE.Line( geometry3, material );
	var line4 = new THREE.Line( geometry4, material );
	var line5 = new THREE.Line( geometry5, material );
	var line6 = new THREE.Line( geometry6, material );

	this.scene.add( line1);
	this.scene.add( line2);
	this.scene.add( line3);
	this.scene.add( line4);
	this.scene.add( line5);
	this.scene.add( line6);

}

Particles3D.prototype.init = function(){
	
	this.numberOfQuads = 1;

	this.maxParticles = document.getElementById("partMaxNumOutput").firstChild.nodeValue;
	this.grow = document.getElementById("PartIncreaseOutput").firstChild.nodeValue;
	this.quadArray = new Array();
	this.gravity = document.getElementById("checkBoxGravity").checked;
	this.friction = document.getElementById("checkBoxFriction").checked;
	 
	this.radius = parseFloat(document.getElementById("partRadiusOutput").firstChild.nodeValue);
	this.detail = document.getElementById("partDetailOutput").firstChild.nodeValue;
	 
	this.render = false;
	this.perfectBouncing = false;
	this.bouncy = document.getElementById("partBouncingOutput").firstChild.nodeValue;

	this.canvasWidth = 990;
	this.canvasHeight = 500;
	this.worldDepth = 400;
	
	var view_angle, aspect, near, far;	
	view_angle = 45,
	aspect = this.canvasWidth / this.canvasHeight,
	near = 0.1,
	far = 2000;

	if(window.WebGLRenderingContext){
		this.renderer = new THREE.WebGLRenderer( );
		document.getElementById("partDetail").style.display = "none";
		document.getElementById("partRadius").style.display = "none";
		this.detail = 10;
	} else
		this.renderer = new THREE.CanvasRenderer();
	
	

	this.camera = new THREE.PerspectiveCamera(  view_angle,
								aspect,
								near,
								far  );
	
	
	this.scene = new THREE.Scene();

	// the this.camera starts at 0,0,0 so pull it back
	this.camera.position.z = 610;

	// start the this.renderer
	this.renderer.setSize(this.canvasWidth, this.canvasHeight);
	this.myCanvas = document.getElementById("content");
	// attach the render-supplied DOM element
	this.myCanvas.appendChild(this.renderer.domElement);

	
	var pointLight = new THREE.PointLight( 0xFFFFFF );
	
	// set its position
	pointLight.position.x = 0;
	pointLight.position.y = 500;
	pointLight.position.z = -250;
	
	// add to the this.scene
	this.scene.add(pointLight);
	
	
	this.reset = false;

}

Particles3D.prototype.addEventListeners = function(){

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

	document.getElementById("partRadius").addEventListener("change",function(e) {
		thisObject.radius = parseFloat(e.target.value);
		for(i in thisObject.quadArray){
			thisObject.quadArray[i].geometry = new THREE.SphereGeometry(thisObject.radius, thisObject.detail, thisObject.detail);
			thisObject.quadArray[i].thisObject.radius = thisObject.radius;
		}
		;
		
	},false);

	document.getElementById("partDetail").addEventListener("change",function(e) {
		var newDetail = parseInt(e.target.value);
		for(i in thisObject.quadArray){
			thisObject.quadArray[i].geometry = new THREE.SphereGeometry(thisObject.radius, newDetail, newDetail);
		}
		thisObject.detail = newDetail;
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
		for(var i in thisObject.quadArray){  
				 thisObject.scene.remove(thisObject.quadArray[i]);
		 }
		 thisObject.quadArray = new Array();
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
    
document.getElementById("partRadius").addEventListener("change",function(e){
        document.getElementById("partRadiusOutput").firstChild.nodeValue = e.target.value;
    },false);
    
document.getElementById("partDetail").addEventListener("change",function(e){
        document.getElementById("partDetailOutput").firstChild.nodeValue = e.target.value;
    },false);  	
	
}

