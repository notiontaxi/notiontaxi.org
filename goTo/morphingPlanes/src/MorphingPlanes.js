/*
main class

Florian Wokurka (2011)
Feel free to use.

// TODO: update boundingBox for better intersection 

*/
 
window.MorphingPlanes = MorphingPlanes;
console.log("start load");
"use strict";


function MorphingPlanes(){

	$("#content").css('height', 600);
	
	var initWidth;
	var initHeight;
	var canvasWidth;
	var canvasHeight;
	var my3DContent;
	var myVideo;
	var myVideo2

	var mesh;
	var renderer;
	var camera;
	var scene;
	var worldDepth;


	var morphPlanes;

	// flags
	var render;

	// for intersection
	var projector;
	var aktMousePosX;
	var aktMousePosY;

	var lastOne;

	this.waitForVideo();

}


MorphingPlanes.prototype.start = function() {
	$('#content').hide().fadeIn(1000);	
	this.render = true;
	this.myVideo.play();
	this.myVideo2.play();	


}

MorphingPlanes.prototype.stop = function() {
	$('#content').stop().fadeOut(800);	
	this.render = false;
	this.myVideo.pause();
	this.myVideo2.pause();	

}


MorphingPlanes.prototype.waitForVideo = function(){
	
	if(window.WebGLRenderingContext){
		if(!this.myVideo){
			var thisObject = this;
			this.myVideo = ($("#myVideo"))[0];
			this.myVideo.pause();
			this.myVideo2 = ($("#myVideo_z"))[0];
			this.myVideo2.pause();
		}
		if (!(this.myVideo.readyState === this.myVideo.HAVE_ENOUGH_DATA)){
			setTimeout(function(){thisObject.waitForVideo();},50);
		}else{
			console.log("WebGL");
			this.init();
			this.addMorphingPlanes();
			this.addPlanes();
			this.addEventListeners();

			setTimeout(function(){thisObject.loop();},100);
		}
	} else{
		console.log("no WebGL");
		this.fillNoWebGLContent();
	}
}




MorphingPlanes.prototype.loop = function(){

	if(this.render){
		// test intersection 
		var vector = new THREE.Vector3( (this.aktMousePosX / this.canvasWidth*2), (this.aktMousePosY / this.canvasHeight*2), 0.0 );
		this.projector.unprojectVector( vector, this.camera );
		var ray = new THREE.Ray( this.camera.position, vector.subSelf( this.camera.position ).normalize() );
		var c = THREE.Collisions.rayCastNearest( ray );
		
		// start morphing
		if(c){
			if(c.mesh instanceof MorphPlane){
				if(c != this.lastOne){
					c.mesh.startMorph();
					this.lastOne = c;
					console.log("hit!");
				}
			}
		} else
			this.lastOne = null;
		c = null;
		
		// rotate the polygons
		for(var i = 0; i < this.morphPlanes.length; i++){
			if(!this.morphPlanes[i].morphToSculpture){ // if u can see the sculpture
				if((this.morphPlanes[i].rotation.x % 6.4).toFixed(1) == 0.0){ // otherwise the float would be bigger and bigger
					this.morphPlanes[i].rotation.x = 0.15;
				}
				else{
					this.morphPlanes[i].rotation.x += 0.01*i;
				}
				if((this.morphPlanes[i].rotation.y % 6.4).toFixed(1) == 0.0){ // otherwise the float would be bigger and bigger
					this.morphPlanes[i].rotation.y = 0.15;
				}
				else{
					this.morphPlanes[i].rotation.y += 0.01*(i+1);
				}			
			}
		} 
		
		// this.render 
		this.renderer.render(this.scene, this.camera);
	}

	// rule for next call
	var thisObject = this;
	setTimeout(function(){thisObject.loop();},40);
}



MorphingPlanes.prototype.addMorphingPlanes = function(){
	var texture = new THREE.Texture(this.myVideo,1,1);

	var material2 = new THREE.MeshLambertMaterial( { color: 0x22aa33, morphTargets: true } );
	var material1 = new THREE.MeshLambertMaterial( { color: 0xffffff, map: texture ,morphTargets: true} );

	material1.color.setHSV( material1.hue, material1.saturation, 1 );
	this.renderer.initMaterial( material1, this.scene.lights, this.scene.fog );
	material2.color.setHSV( material2.hue, material2.saturation, 1 );
	this.renderer.initMaterial( material2, this.scene.lights, this.scene.fog );		
	
	this.morphPlanes[0] = new MorphPlane(material1, material2, this.initWidth, this.initHeight);
	this.morphPlanes[0].position.x = 0;
	this.morphPlanes[0].position.y = -200; 
	this.morphPlanes[0].position.z = -400;
	this.morphPlanes[0].rotation.x = 0.1;
	this.morphPlanes[0].scale.x = this.morphPlanes[0].scale.y = this.morphPlanes[0].scale.z = 1;
	

	THREE.Collisions.colliders.push( THREE.CollisionUtils.MeshOBB ( this.morphPlanes[0] ) );
	
	this.scene.add(this.morphPlanes[0]);
	
	// ***********************************************************************************************************
	
	texture = new THREE.Texture(this.myVideo2,1,1);

	var material2 = new THREE.MeshLambertMaterial( { color: 0x22aa33, morphTargets: true } );
	var material1 = new THREE.MeshLambertMaterial( { color: 0xffffff, map: texture ,morphTargets: true} );

	material1.color.setHSV( material1.hue, material1.saturation, 1 );
	this.renderer.initMaterial( material1, this.scene.lights, this.scene.fog );
	material2.color.setHSV( material2.hue, material2.saturation, 1 );
	this.renderer.initMaterial( material2, this.scene.lights, this.scene.fog );		
	
	this.morphPlanes[1] = new MorphPlane(material1, material2, this.initWidth, this.initHeight);
	this.morphPlanes[1].position.x = 150;
	this.morphPlanes[1].position.y = 200; 
	this.morphPlanes[1].position.z = -400;
	this.morphPlanes[1].rotation.x = 0.1;
	this.morphPlanes[1].scale.x = this.morphPlanes[1].scale.y = this.morphPlanes[1].scale.z = 1;

	THREE.Collisions.colliders.push( THREE.CollisionUtils.MeshOBB ( this.morphPlanes[1] ) );
	
	this.scene.add(this.morphPlanes[1]);

	// ***********************************************************************************************************
	
	var material2 = new THREE.MeshLambertMaterial( { color: 0x22aa33, morphTargets: true } );
	var material1 = new THREE.MeshLambertMaterial( { color: 0xffffff, map: texture ,morphTargets: true} );

	material1.color.setHSV( material1.hue, material1.saturation, 1 );
	this.renderer.initMaterial( material1, this.scene.lights, this.scene.fog );
	material2.color.setHSV( material2.hue, material2.saturation, 1 );
	this.renderer.initMaterial( material2, this.scene.lights, this.scene.fog );		
	
	this.morphPlanes[2] = new MorphPlane(material1, material2, this.initWidth, this.initHeight);
	this.morphPlanes[2].position.x = -250;
	this.morphPlanes[2].position.y = 50; 
	this.morphPlanes[2].position.z = -200;
	this.morphPlanes[2].scale.x = this.morphPlanes[2].scale.y = this.morphPlanes[2].scale.z = 1;


	THREE.Collisions.colliders.push( THREE.CollisionUtils.MeshOBB ( this.morphPlanes[2] ) );

	this.scene.add(this.morphPlanes[2]);	
	
// DIRTY HACK!
// TODO: update boundingBox
	for(var coll = 0; coll < THREE.Collisions.colliders.length; coll++){
		var colliderGeo = THREE.Collisions.colliders[coll].mesh.geometry;
		colliderGeo.__dirtyVertices = true;
		
		var boxColl = THREE.Collisions.colliders[coll];
		boxColl.mesh.geometry.__dirtyVertices = true;
		
		colliderGeo.computeBoundingBox();
		
		var b = colliderGeo.vertices;
		boxColl.min = new THREE.Vector3( -100, -100, -100 );
		boxColl.max = new THREE.Vector3( 100, 100, 100 );
	}	
	
}

MorphingPlanes.prototype.addPlanes = function(){
	var material = new THREE.MeshLambertMaterial( { color: 0xffffff } );
	// lower plane----------------------------------------------------------
	var geometry = new THREE.PlaneGeometry( this.worldDepth, this.canvasWidth, 1,1);
	var planeMesh = new THREE.Mesh( geometry, material );
	planeMesh.position.x = 0;
	planeMesh.position.y = - this.canvasHeight/2; 
	planeMesh.position.z = -250;
	planeMesh.rotation.x = -(Math.PI/2);
	this.scene.add(planeMesh);
    // left plane---------------------------------------------------------
	geometry = new THREE.PlaneGeometry( this.worldDepth, this.canvasHeight, 1,1);
	planeMesh = new THREE.Mesh( geometry, material );
	planeMesh.position.x = -this.canvasWidth/2;
	planeMesh.position.y = 0; 
	planeMesh.position.z = 0;
	planeMesh.rotation.y = (Math.PI/2);
	this.scene.add(planeMesh);
	// right plane----------------------------------------------------------
	geometry = new THREE.PlaneGeometry( this.worldDepth, this.canvasHeight, 1,1);
	planeMesh = new THREE.Mesh( geometry, material );
	planeMesh.position.x = this.canvasWidth/2;
	planeMesh.position.y = 0; 
	planeMesh.position.z = 0;
	planeMesh.rotation.y = -(Math.PI/2);
	this.scene.add(planeMesh);	
	// back plane---------------------------------------------------------
	geometry = new THREE.PlaneGeometry( this.canvasWidth, this.canvasHeight, 1,1);
	planeMesh = new THREE.Mesh( geometry, material );
	planeMesh.position.x = 0;
	planeMesh.position.y = 0; 
	planeMesh.position.z = -this.worldDepth/2;
	planeMesh.rotation.y = 0;
	this.scene.add(planeMesh);		

}


MorphingPlanes.prototype.init = function(){
	this.projector = new THREE.Projector();
	this.morphPlanes = [];

	this.initWidth = this.myVideo.videoWidth;
	this.initHeight = this.myVideo.videoHeight;
	
	this.render = true;
  
    this.canvasWidth = 990;
    this.canvasHeight = 590;
	this.worldDepth = 1500;

    var view_angle = 45;
    var aspect = this.canvasWidth / this.canvasHeight;
    var near = 0.1;
    var far = 3000;

	this.renderer = new THREE.WebGLRenderer(  );

    this.camera = new THREE.PerspectiveCamera(  view_angle,
                                aspect,
                                near,
                                far  );
   
	this.scene = new THREE.Scene();
	
    this.camera.position.z = this.canvasHeight * 1.21;

	var poiLight1 = new THREE.PointLight( 0xFFFFFF , 0.5, 2000);
	poiLight1.position.x = 0;
	poiLight1.position.y = 0;
	poiLight1.position.z = 200;
	this.scene.add(poiLight1);
	var poiLight2 = new THREE.PointLight( 0xFFFFFF , 0.5, 2000);
	poiLight2.position.x = 0;
	poiLight2.position.y = 200;
	poiLight2.position.z = -300;
	this.scene.add(poiLight2);
	var ambLight = new THREE.AmbientLight( 0x666666 );	
	this.scene.add(ambLight);
    this.renderer.setSize(this.canvasWidth, this.canvasHeight);
    this.my3DContent = document.getElementById("content");
	
	// remove "... loading ..."
	this.my3DContent.removeChild(this.my3DContent.lastChild);
	
	
    // attach the DOM element
    this.my3DContent.appendChild(this.renderer.domElement);
}



MorphingPlanes.prototype.addEventListeners = function(){

	var thisObject = this;

	document.getElementById("ButtonMorph").addEventListener("click",function(e){
		for(var i = 0; i < thisObject.morphPlanes.length; i++){
			thisObject.morphPlanes[i].startMorph();			
		}	
	},false);

	document.getElementById("checkBoxRender").addEventListener("click",function(e) {
		thisObject.render = e.target.checked;
	},false);
	
	document.addEventListener("mousemove", function(e){
	
		thisObject.aktMousePosX = window.mousePosX(e);
		thisObject.aktMousePosY = window.mousePosY(e);
		
		
	},false);

	document.getElementById("duration").addEventListener("change",function(e){
		var duration = e.target.value;
		for(var num = 0; num < thisObject.morphPlanes.length; num++)
			thisObject.morphPlanes[num].setDuration(duration);
		},false);
				
}

MorphingPlanes.prototype.fillNoWebGLContent = function(){
	
	var my_NOT_3DContent = document.getElementById("content");
	my_NOT_3DContent.removeChild(my_NOT_3DContent.lastChild);
	
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
	image.src = "./images/noWebGL/morphingPlane.jpg";

	my_NOT_3DContent.appendChild(image);
}
