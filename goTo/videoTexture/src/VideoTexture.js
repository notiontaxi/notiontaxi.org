/*
class VideoTexture

Florian Wokurka (2011)
Feel free to use.

*/
 
window.VideoTexture = VideoTexture; 
"use strict";



function VideoTexture(){
$("#content").css('height', 610);
var initWidth;
var initHeight;
// attributes of the canvas
var canvasWidth;
var canvasHeight;
var worldDepth;
var my3DContent;
// set some camera attributes

var renderer;
var camera;
var scene;

var myVideo;

var render;

var texture;
var meshes;
var xGrid;
var yGrid;

this.waitForVideo();
}


VideoTexture.prototype.start = function(){
	$('#content').hide().fadeIn(1000);
	this.myVideo.play();
	this.render = true;
}

VideoTexture.prototype.stop = function(){
var thisObject = this;
	$('#content').stop().fadeOut(800, function(){
		thisObject.myVideo.pause();
		thisObject.render = false;
	});
}

VideoTexture.prototype.waitForVideo = function(){
	this.render = false;
	if(window.WebGLRenderingContext){
		var thisObject = this;
		this.myVideo = ($("#myVideo"))[0];
		this.myVideo.pause();

		if (!(this.myVideo.readyState === this.myVideo.HAVE_ENOUGH_DATA)){
			setTimeout(function(){thisObject.waitForVideo();},50);
		}else{
			this.init();
			this.addLines();
			this.addBoxes();
			this.addEventListeners();
			this.loop();
		}
	} else
		fillNoWebGLContent();
}




VideoTexture.prototype.loop = function(){

	var thisObject = this;
	// rule for the next call
	if(this.render){
		setTimeout(function(){thisObject.loop();},40);
		this.renderer.render(this.scene, this.camera);
	}else
        setTimeout(function(){thisObject.nothing();},250);

	if ( this.myVideo.readyState === this.myVideo.HAVE_ENOUGH_DATA ) {
		if ( this.texture ) this.texture.needsUpdate = true;
	}

	

}

//adapted from https://github.com/mrdoob/three.js/blob/master/examples/webgl_materials_video.html#L104
VideoTexture.prototype.change_uvs = function( geometry, unitx, unity, offsetx, offsety ) {

		var i, j, uv;

		for ( i = 0; i < geometry.faceVertexUvs[ 0 ].length; i++ ) {
			uv = geometry.faceVertexUvs[ 0 ][ i ];
			for ( j = 0; j < uv.length; j++ ) {
				uv[j].u = ( uv[j].u + offsetx ) * unitx;
				uv[j].v = ( uv[j].v + offsety ) * unity;

			}
		}
	}

VideoTexture.prototype.nothing = function(){
	var thisObject = this;
	// rule for the next call
	if(this.render)
		setTimeout(function(){thisObject.loop();},40);
	else
        setTimeout(function(){thisObject.nothing();},250);
}


VideoTexture.prototype.addBoxes = function(e_xGrid, e_yGrid){
	
	// check parameters
	if(e_xGrid)
		this.xGrid = e_xGrid;
	else
		this.xGrid = 4
	
	if(e_yGrid)
		this.yGrid = e_yGrid;
	else
		this.yGrid = 3;
	
	
	if(this.meshes){
	   // delete if there exists any mashes
	   for(var i = 0; i < this.meshes.length; i++){
			this.scene.remove(this.meshes[i]);
		}
	}
	this.meshes = new Array;

	this.texture = new THREE.Texture(this.myVideo,1,1);
	var geometry, xsize, ysize;

	xsize = (this.initWidth/this.xGrid) * 0.8;
	ysize = (this.initHeight/this.yGrid) * 0.8;

	var parameters = { color: 0xffffff, map: this.texture };
	var material_base = new THREE.MeshLambertMaterial( parameters );

	this.renderer.initMaterial( material_base, this.scene.lights, this.scene.fog );
	
	ux = 1 / this.xGrid;
	uy = 1 / this.yGrid;
	
	for ( var x = 0; x < this.xGrid; x++ )
	for ( var y = this.yGrid; y > 0; y-- ) {	
	
		geometry = new THREE.CubeGeometry( xsize, ysize, xsize );
		this.change_uvs( geometry, ux, uy, x, this.yGrid-y );
		
		
		material = new THREE.MeshLambertMaterial( parameters );

		material.color.setHSV( material.hue, material.saturation, 1 );

		mesh = new THREE.Mesh( geometry, material );

			mesh.position.x = (xsize * x)       - (xsize*this.xGrid/2) + (xsize/2);
			mesh.position.y = ((ysize) * (y-1)) - (ysize*this.yGrid/2) + (ysize/2); 
			mesh.position.z = this.xGrid *3;

			mesh.scale.x = mesh.scale.y = mesh.scale.z = 1;

			this.scene.add(mesh);
			this.meshes.push(mesh);
			
	}
}



VideoTexture.prototype.addLines = function(){

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

VideoTexture.prototype.init = function(){

	var view_angle, aspect, near, far;
	this.initWidth = this.myVideo.videoWidth;
	this.initHeight = this.myVideo.videoHeight;
	
	this.render = false;
  
	// Scene setup ******************************************************************************
    this.canvasWidth = 990;
    this.canvasHeight = 600;
	this.worldDepth = 500;

    view_angle = 45,
    aspect = this.canvasWidth / this.canvasHeight,
    near = 0.1,
    far = 1500;

	this.renderer = new THREE.WebGLRenderer(  );
    //this.renderer = new THREE.CanvasRenderer();

    this.camera = new THREE.PerspectiveCamera(  view_angle,
                                aspect,
                                near,
                                far  );
   
	this.scene = new THREE.Scene();

    // the this.camera starts at 0,0,0 so pull it back
    this.camera.position.z = this.canvasHeight*1.21; // why 1.21? ask god 0o

    // start the this.renderer
    this.renderer.setSize(this.canvasWidth, this.canvasHeight);
    this.my3DContent = ($("#content"))[0];
    // attach the render-supplied DOM element
    this.my3DContent.appendChild(this.renderer.domElement);

    var pointLight = new THREE.DirectionalLight( 0xFFFFFF , 1.0, 500);
    // set its position
    pointLight.position.x = -300;
    pointLight.position.y = -300;
    pointLight.position.z = 400;
    
    // add to the this.scene
    this.scene.add(pointLight);
	
	// ******************************************************************************************

}




VideoTexture.prototype.addEventListeners = function(){
	var thisObject = this;

	$("#checkBoxRender").bind("click",function(e) {
		thisObject.render = e.target.checked;
	});

	document.addEventListener("mousemove", function(e){
		var aktMousePosY = window.innerHeight - (window.mousePosY(e)<<1);
		aktMousePosY /= 1000;
		var aktMousePosX = window.innerHeight - (window.mousePosX(e)<<1);
		aktMousePosX /= 1000;	
		
		for(var i = 0; i < thisObject.meshes.length; i++){
			thisObject.meshes[i].rotation.x = -aktMousePosY;
			thisObject.meshes[i].rotation.y = -aktMousePosX;
		}
		
	},false);


$("#numX").bind("change",function(e){

	var val = e.target.value;
   thisObject.addBoxes(val, thisObject.yGrid);
    });

$("#numY").bind("change",function(e){

	var val = e.target.value;
    thisObject.addBoxes(thisObject.xGrid, val);
    });

$("#numX").bind("change",function(e){
    $("#numXOutput").text(e.target.value);
    });

$("#numY").bind("change",function(e){
    $("#numYOutput").text(e.target.value);
});
	
	
}

VideoTexture.prototype.fillNoWebGLContent = function(){

	my_NOT_3DContent = $("#content");
	
	var div = document.createElement("div");
	var text = document.createTextNode("Sorry, but your browser does not seem to support WebGL.");
	div.appendChild(text);
	my_NOT_3DContent.appendChild(div);
	
	div = document.createElement("div");
	text = document.createTextNode("Please update your Browser or get one, which supports WebGL. ");
	div.appendChild(text);
	my_NOT_3DContent.appendChild(div);
	
	div = document.createElement("div");
	text = document.createTextNode("You can check the WebGL support of your browser ");
		
	var link = document.createElement("a");
	link.href = "http://get.webgl.org/";
	link.appendChild(document.createTextNode("on this page."));
	
	div.appendChild(text);
	div.appendChild(link);
	my_NOT_3DContent.appendChild(div);
	
	my_NOT_3DContent.appendChild(div);
	
	var image = document.createElement("img");
	image.src = "../../images/noWebGL/videoTexture.jpg";

	my_NOT_3DContent.appendChild(image);
}

