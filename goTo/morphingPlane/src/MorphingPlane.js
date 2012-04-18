/*
MorphingPlane class

Florian Wokurka (2012)
Feel free to use.

*/

 
window.MorphingPlane = MorphingPlane; 
"use strict";


function MorphingPlane(){
	$("#content").css('height', 600);
	var initWidth;
	var initHeight;
	// attributes of the canvas
	var canvasWidth;
	var canvasHeight;
	var worldDepth;
	var my3DContent;
	var pointLight;
	var ambientLight;
	// set some camera attributes

	var renderer;
	var scene;
	var camera;

	var myVideo_show;
	var myVideo_z;

	var render;

	var texture;
	var mesh;

	var myCanvasDummy;
	var	dummy;	
	var zPosi;

	var luminanceValues;

	var reset;
	var planeDetail = 2;

	var imageData;
	var data;
	var length;
	var vertexCount;
	var vertLength;
	var rows;
	var pixelNr;

	var r;
	var g;
	var b;

	var darkness;
	var changeVideo;
	var changeZ;
	
	this.waitForVideo();
}
 
MorphingPlane.prototype.start = function() {
	$('#content').hide().fadeIn(1000);	
	this.render = true;
	this.myVideo_show.play();
	this.myVideo_z.play();	

}

MorphingPlane.prototype.stop = function() {
	$('#content').stop().fadeOut(800);	
	this.render = false;
	this.myVideo_show.pause();
	this.myVideo_z.pause();	

}

MorphingPlane.prototype.waitForVideo = function(){
	
	if(window.WebGLRenderingContext){
		var thisObject = this;
		this.fillLoadingContent();
		this.myVideo_show = ($("#myVideo"))[0];
		this.myVideo_show.pause();
		this.myVideo_z = ($("#myVideo_z"))[0];
		this.myVideo_z.pause();

		if (!(this.myVideo_show.readyState === this.myVideo_show.HAVE_ENOUGH_DATA)){
			setTimeout(function(){thisObject.waitForVideo();},50);
		}else{
			this.init();
			this.addLines();
			this.addPlane();
			this.addEventListeners();
			this.texture.needsUpdate = true;

			setTimeout(function(){thisObject.loop();},100);
		}
	} else
		this.fillNoWebGLContent();
}
MorphingPlane.prototype.loop = function(){
	// rule for the next call
	var thisObject = this;
	if(this.render){
		this.updateVideo();
		this.updatePlane();
		setTimeout(function(){thisObject.loop()},40);
	} else
        setTimeout(function(){thisObject.nothing()},250);
}

MorphingPlane.prototype.updateVideo = function(){
	if ( this.myVideo_show.readyState === this.myVideo_show.HAVE_ENOUGH_DATA ) {
		if ( this.texture ) 
			this.texture.needsUpdate = true;
	}
	this.renderer.render(this.scene, this.camera);
}

MorphingPlane.prototype.updatePlane = function(){
	if(this.changeZ){
		this.dummy.drawImage(this.myVideo_show, 0,0,this.initWidth, this.initHeight);
	}
	else
		this.dummy.drawImage(this.myVideo_z, 0,0,this.initWidth, this.initHeight);
		
	// grab pixel informations from dummy canvas
	this.imageData = this.dummy.getImageData(0,0,this.initWidth, this.initHeight);

	this.data = this.imageData.data;
	this.length = this.data.length;
	var vertexCount = 0;
	var vertLength = this.mesh.geometry.vertices.length;
	var rows = 1;
	var PixelNr;
	
	for(var i = 0; i < this.length; i+=(this.planeDetail<<2)){

		// colors (only if needed)
		this.r = this.data[i];
		this.g = this.data[i+1];
		this.b = this.data[i+2];
		
		PixelNr = i>>>2;
		
		// jump to next row
		if(PixelNr%this.initWidth == 0){
			i += ((this.planeDetail-1)*this.initWidth)*4;
			rows++;
		}

		
		if(vertexCount < vertLength){
		// dark colors to the front
			if(this.darkness)
				this.mesh.geometry.vertices[vertexCount].position.z = 1000 -  (this.r+this.g+this.b)>>>4;
		// bright colors to the front
			else
				this.mesh.geometry.vertices[vertexCount].position.z = (this.r+this.g+this.b)>>>4;
		}
		
		vertexCount++;
	}	
	
	this.mesh.geometry.__dirtyVertices = true;
}


MorphingPlane.prototype.nothing = function(){
	var thisObject = this;
	if(this.render)
		setTimeout(function(){thisObject.loop()},40);
	else{
        setTimeout(function(){thisObject.nothing()},40);
		}
}


MorphingPlane.prototype.addPlane = function(e_xSegments, e_ySegments){

	var xSegments;
	var ySegments;
	
	// check parameters
	if(e_xSegments)
		xSegments =	e_xSegments;
	else
		xSegments = (this.initWidth/this.planeDetail) -1;
	
	if(e_ySegments)
		ySegments = e_ySegments;
	else
		ySegments = (this.initHeight/this.planeDetail)-1;
		
	xSegments = Math.round(xSegments);
	ySegments = Math.round(ySegments);
		
	console.log(this.planeDetail);	
		
	if(this.mesh)
		this.scene.remove(this.mesh);

	if(this.changeVideo){
		this.texture = new THREE.Texture(this.myVideo_show,1,1);
		this.myVideo_show.volume = 1;
	} else{
		this.texture = new THREE.Texture(this.myVideo_z,1,1);
		this.myVideo_show.volume = 0;
	}
		
	var parameters = { color: 0xffffff, map: this.texture };
	var material = new THREE.MeshLambertMaterial( parameters );
	
	//console.log(this.initWidth + " " + this.initHeight + " " + xSegments + " " + ySegments);
	var geometry = new THREE.PlaneGeometry( this.initWidth, this.initHeight, xSegments,ySegments);
	
	geometry.dynamic = true;

	this.mesh = new THREE.Mesh( geometry, material );
	this.mesh.position.x = 0;
	this.mesh.position.y = 0; 
	this.mesh.position.z = this.zPosi;
	this.mesh.rotation.x = 0.3;
	this.mesh.rotation.y = 0.9;
	this.mesh.doubleSided = true;
	
	//this.renderer.initMaterial( material, this.scene.lights, this.scene.fog );

	this.scene.add(this.mesh);
	

}



MorphingPlane.prototype.addLines = function(){

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

this.scene.add(line1);
this.scene.add(line2);
this.scene.add(line3);
this.scene.add(line4);
this.scene.add(line5);
this.scene.add(line6);

}

MorphingPlane.prototype.init = function(){

	var thisObject = this;
	this.planeDetail = 3;
	var view_angle, aspect, near, far;
	
	this.luminanceValues = new Array();

	this.initWidth = this.myVideo_show.videoWidth;
	this.initWidth = this.initWidth - (this.initWidth%10);
	this.initHeight = this.myVideo_show.videoHeight;
	this.initHeight = this.initHeight - (this.initHeight%10);
	this.myVideo_show.volume = 0;
		
	
	
	this.myCanvasDummy = $("<canvas id='myCanvasDummy' class='invisible' align='right'>  </canvas>");

	this.dummy = this.myCanvasDummy[0].getContext("2d");
	this.myCanvasDummy[0].width = this.initWidth;
    this.myCanvasDummy[0].height = this.initHeight;
	this.darkness = false;
	this.render = false;
	this.changeVideo = false;
    this.changeZ = false;
  
	// Scene setup ******************************************************************************
	this.zPosi = -200;
	
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
    this.camera.position.z = this.canvasHeight*1.21; 

	
		
	
    // start the this.renderer
    this.renderer.setSize(this.canvasWidth, this.canvasHeight);
    this.my3DContent = ($("#content"))[0];
	
	
	//this.my3DContent.appendChild(this.renderer.domElement);
	
	var aktChildNode = this.my3DContent.firstChild;
    var nextChild;
		
	while(aktChildNode != null){

		nextChild = aktChildNode.nextSibling; 
		this.my3DContent.removeChild(aktChildNode);
		aktChildNode = nextChild;
		
	} 	
	
    // attach the this.render-supplied DOM element
    this.my3DContent.appendChild(this.renderer.domElement);

	this.ambientLight = new THREE.AmbientLight( 0x999999, 1.0);
    this.pointLight = new THREE.PointLight( 0xFFFFFF , 2, 1000);
    // set its position

    this.pointLight.position.x = 0;
    this.pointLight.position.y = 0;
    this.pointLight.position.z = 400;

	this.scene.add(this.ambientLight);
    //this.scene.add(this.pointLight);
	this.scene.add(this.camera);
	
	// ******************************************************************************************

}


MorphingPlane.prototype.addEventListeners = function(){

	var thisObject = this;

	$("#checkBoxRender").bind("click",function(e) {
		thisObject.render = e.target.checked;
	});

	$("#content").bind("mousemove", function(e){
		var aktMousePosY = window.innerHeight - (window.mousePosY(e)<<1);
		aktMousePosY /= 250;
		var aktMousePosX = window.innerHeight - (window.mousePosX(e)<<1);
		aktMousePosX /= 500;
		
		thisObject.mesh.rotation.x = (-aktMousePosY % 100) -0.3;
		thisObject.mesh.rotation.y = (-aktMousePosX % 100 -0.3);

		
	});
	
	$("#content").bind("mouseout", function(e){
		thisObject.mesh.rotation.x = 0.3;
		thisObject.mesh.rotation.y = 0.9;

		
	});	


	$("#zposi").bind("change",function(e){
		thisObject.zPosi = e.target.value;
		thisObject.mesh.position.z = thisObject.zPosi;
		});

	$("#detail").bind("change",function(e){
		thisObject.planeDetail =  e.target.value;
		// TODO: fix 4 and 7
		if(thisObject.planeDetail == 4)
			thisObject.planeDetail = 5;
		thisObject.addPlane();

		});


	$("#checkBoxDarkness").bind("click",function(e) {
			thisObject.darkness = e.target.checked;
		});
		
	$("#checkBoxVideo").bind("click",function(e) {
			thisObject.changeVideo = e.target.checked;
			thisObject.addPlane();
		});
		
	$("#checkBoxZ").bind("click",function(e) {
			thisObject.changeZ = e.target.checked;
		});	

	$("#myVideo_z").bind("ended",function(e) {
			e.target.play();
		});

	$("#myVideo_show").bind("ended",function(e) {
			e.target.play();
		});		
		
	$("#zposi").bind("change",function(e){
    $("#zposiOutput").text(e.target.value);
    });

	$("#detail").bind("change",function(e){
		$("#detailOutput").text(e.target.value);
    });	
}

MorphingPlane.prototype.fillLoadingContent = function(){

	$("#my_NOT_3DContent").add('<div >... still loading ...</div>');
	
}

MorphingPlane.prototype.fillNoWebGLContent = function(){

	var my_NOT_3DContent = $("#content");
	
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
	image.src = "../../images/noWebGL/morphingVideo.jpg";

	my_NOT_3DContent.appendChild(image);
}



