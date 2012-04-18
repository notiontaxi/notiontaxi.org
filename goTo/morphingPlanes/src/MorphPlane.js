/*
morphingPlane class

Florian Wokurka (2011)
Feel free to use.

*/
 
(function () {

	"use strict";
	window.MorphPlane = MorphPlane;
	MorphPlane.prototype = THREE.Mesh.prototype;
	MorphPlane.prototype.constructor = MorphPlane;


	function MorphPlane(e_videoMaterial, e_polygonMaterial, e_width, e_height){

		var width;
		var height;
		
		this.morphToSculpture = true; 
		this.animationEnded = true;
		this.rotationEndedX = true;
		this.rotationEndedY = true;
		this.rotationEnded = true;
		this.refreshVideoTexture = true;
		this.videoIsOnShow = true;
		
		this.klickTime;    
		this.duration;     
		this.time;	
		this.interpolValue;
		this.interpolMaxValue;	
		
		this.setDuration(1000);
		
		//call superconstruktor      
		THREE.Mesh.call(this);
		
		// set dafeult values
		this.xSegments = 9; // 10 vertices
		this.ySegments = 9;
	
		// check parameters 
		// TODO: check if the first on is a html5 video element 
		if(e_videoMaterial){
			this.myMaterial =  e_videoMaterial;
		} else {
			this.myMaterial =  new THREE.MeshLambertMaterial( { color: 0x55ff55 ,morphTargets: true} );
			console.log("MorphPlane: Missing parameter: videoMaterial")
		}
		if(e_polygonMaterial){
			this.myAlternativeMaterial =  e_polygonMaterial;
		} else {
			this.myAlternativeMaterial =  new THREE.MeshLambertMaterial( { color: 0x5555ff ,morphTargets: true} );
			console.log("MorphPlane: Missing parameter: polygonMaterial")
		}		
		if(e_width){
			width = e_width;
		} else {
			width = 100;
			console.log("MorphPlane: Missing parameter: width")
		}
		if(e_height){
			height = e_height;
		} else {
			height = 100;
			console.log("MorphPlane: Missing parameter: height")
		}

		this.materials[0] = this.myMaterial;
		this.geometry = new THREE.PlaneGeometry( width, height, 9, 9 );
		this.geometry.dynamic = true;
		this.dynamic = true;
		this.doubleSided = true;
		
		this.createMorphingValues();
		this.startRefreshingVideoTexture(this);
	}
	
	MorphPlane.prototype.createMorphingValues = function(){

		var verticesKeyFrame1 = [];
		var verticesKeyFrame2 = [];

		// create keyframes
		for ( var i = 0; i < this.geometry.vertices.length; i++ ) {
			// copy original positions
			verticesKeyFrame1[i] = ( new THREE.Vertex( this.geometry.vertices[i].position.clone() ) );	
			verticesKeyFrame2[i] = ( new THREE.Vertex( this.geometry.vertices[i].position.clone() ) );	
			
			// modify vertices in keyframe 1
			if(i < 10){
				verticesKeyFrame1[i].position.x = 50;
				verticesKeyFrame1[i].position.y = 23;
				verticesKeyFrame1[i].position.z = 100;
			} else if (i > 89) {
				verticesKeyFrame1[i].position.x = 50;
				verticesKeyFrame1[i].position.y = 23;
				verticesKeyFrame1[i].position.z = 100;
			} else if (i%10 === 9){
				verticesKeyFrame1[i].position.x = 50;
				verticesKeyFrame1[i].position.y = 23;
				verticesKeyFrame1[i].position.z = 100;
			} else if (i%10 === 0){
				verticesKeyFrame1[i].position.x = 50;
				verticesKeyFrame1[i].position.y = 23;
				verticesKeyFrame1[i].position.z = 100;
			} else if(false){
				verticesKeyFrame1[i].position.x = -50;
				verticesKeyFrame1[i].position.y = -23;
				verticesKeyFrame1[i].position.z = -100;
			}else if (false) {
				verticesKeyFrame1[i].position.x = -50;
				verticesKeyFrame1[i].position.y = -23;
				verticesKeyFrame1[i].position.z = -100;
			} else{
				verticesKeyFrame1[i].position.x = verticesKeyFrame1[i].position.x * 0.7 - i;
				verticesKeyFrame1[i].position.y = verticesKeyFrame1[i].position.y * 0.8 + i;
				verticesKeyFrame1[i].position.z = -i;
			} 
		}	
		// Push it to the keyframes array
		this.geometry.morphTargets.push( {  vertices: verticesKeyFrame1 } );
		this.geometry.morphTargets.push( {  vertices: verticesKeyFrame2 } );


		// calc bound radius

		if( !this.geometry.boundingSphere ) {
			this.geometry.computeBoundingSphere();
		}

		this.boundRadius = this.geometry.boundingSphere.radius;


		// setup morph targets

		if( this.geometry.morphTargets.length ) {

			this.morphTargetBase = -1;
			this.morphTargetForcedOrder = [];
			this.morphTargetInfluences = [];
			this.morphTargetDictionary = {};

			for( var m = 0; m < this.geometry.morphTargets.length; m ++ ) {
				this.morphTargetInfluences.push( 0 );
				this.morphTargetDictionary[ this.geometry.morphTargets[ m ].name ] = m;
			}
		}

	}
		
	MorphPlane.prototype.startRefreshingVideoTexture = function(e_thisObject){
		if ( e_thisObject.myMaterial.map.image.readyState === e_thisObject.myMaterial.map.image.HAVE_ENOUGH_DATA )
			 e_thisObject.myMaterial.map.needsUpdate = true;
			
		if(e_thisObject.videoIsOnShow)
			setTimeout(function(){e_thisObject.startRefreshingVideoTexture(e_thisObject)},40);		
	}	
		
		
	MorphPlane.prototype.startMorph = function(){
		if( this.animationEnded && 
			this.rotationEndedX &&
			this.rotationEndedY){			
			this.klickTime = new Date().getTime();
			this.animationEnded = false;
			var thisObject = this;
			setTimeout(function(){thisObject.morph(thisObject)},40);
		}
	}

	MorphPlane.prototype.morph = function(e_this){

		var thisObject = e_this;
		
		if(!thisObject.animationEnded){
			thisObject.time = (new Date().getTime() - thisObject.klickTime) % thisObject.duration;
			thisObject.interpolValue = thisObject.time / thisObject.duration;

			// when nearly the end on the animation is reached
			if ( thisObject.interpolValue >= thisObject.interpolMaxValue ) {
				// set min/max value
				if(thisObject.morphToSculpture){
					thisObject.videoIsOnShow = false;
					thisObject.morphTargetInfluences[ 0 ] = 1;
					}
				else{
					thisObject.videoIsOnShow = true;
					thisObject.morphTargetInfluences[ 0 ] = 0;
					thisObject.startRotateToViewer(thisObject);
					thisObject.startRefreshingVideoTexture(thisObject);
				}	
					thisObject.changeMaterial();
				// set flags
				thisObject.morphToSculpture = !thisObject.morphToSculpture;
				thisObject.animationEnded = true;
				thisObject.geometry.__dirtyVertices = true;
				
			} else {
				// interpolate
				if(thisObject.morphToSculpture)
					thisObject.morphTargetInfluences[ 0 ] = thisObject.interpolValue;
				else	
					thisObject.morphTargetInfluences[ 0 ] = 1 - thisObject.interpolValue;
					
				setTimeout(function(){thisObject.morph(thisObject)},40);
			}		
		}
	}	
		
	MorphPlane.prototype.startRotateToViewer = function(e_this){
		e_this.rotationEndedX = false;
		e_this.rotateToViewerX(e_this);
		e_this.rotationEndedY = false;
		e_this.rotateToViewerY(e_this);
	}	
		
	MorphPlane.prototype.rotateToViewerX = function(e_this){
		
		var thisObject = e_this;

		if(thisObject.rotation.x > 3.1){
			if(thisObject.rotation.x < 6.09){
				thisObject.rotation.x += 0.1; 
				setTimeout(function(){thisObject.rotateToViewerX(thisObject)},40);
			} else{
				thisObject.rotation.x = 0.0;
				thisObject.rotationEndedX = true;
			}
		} else {
			if(thisObject.rotation.x > 0.11){
				thisObject.rotation.x -= 0.1; 
				setTimeout(function(){thisObject.rotateToViewerX(thisObject)},40);
			} else{
				thisObject.rotation.x = 0.0;
				thisObject.rotationEndedX = true;
			}			
		}	

	}

	MorphPlane.prototype.rotateToViewerY = function(e_this){
		
		var thisObject = e_this;
		
		if(thisObject.rotation.y > 3.1){
			if(thisObject.rotation.y < 6.09){
				thisObject.rotation.y += 0.1; 
				setTimeout(function(){thisObject.rotateToViewerY(thisObject)},40);
			} else{
				thisObject.rotation.y = 0.0;
				thisObject.rotationEndedY = true;
			}
		} else {
			if(thisObject.rotation.y > 0.11){
				thisObject.rotation.y -= 0.1; 
				setTimeout(function(){thisObject.rotateToViewerY(thisObject)},40);
			} else {
				thisObject.rotation.y = 0.0;
				thisObject.rotationEndedY = true;
			}
		}	

	}

	MorphPlane.prototype.setDuration = function(e_duration){
											   // 15 frames per second in worst case
		this.duration = e_duration; 
		this.interpolMaxValue = (this.duration-(this.duration/(15/1000*this.duration)))/this.duration;
	}

	MorphPlane.prototype.changeMaterial = function(){
	if(this.materials[0] === this.myAlternativeMaterial){
		this.materials[0] = this.myMaterial;
		this.myMaterial.map.image.volume = 1;
	} else {
		this.materials[0] = this.myAlternativeMaterial;
		this.myMaterial.map.image.volume = 0;
	}

	}


})();