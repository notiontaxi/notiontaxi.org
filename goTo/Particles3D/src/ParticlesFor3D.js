/* Florian Wokurka (2011)
 *
 * Feel free to use.
 * */

// build subclass
ParticleFor3D.prototype = THREE.Mesh.prototype;
// correct constructor
ParticleFor3D.prototype.constructor = ParticleFor3D;


								
function ParticleFor3D(_radius, _segments, _rings, e_worldWidth, e_worldHeight, e_worldDepth){
 
	window.ParticleFor3D = ParticleFor3D;
	//call superconstruktor      
	THREE.Mesh.call(this);
	
	
	this.geometry = new THREE.SphereGeometry(_radius,
							_segments, 	
							_rings);
						
	
	this.position.x = - this.worldWidth/2 + this.radius*2	; //(Math.random()-0.5) * (this.worldWidth /2);
	this.position.y = this.worldHeight/2 - this.radius*2;
	this.position.z = 0 - this.radius*2;						
	
	this.materials[0] = new THREE.MeshLambertMaterial({color: 0x00cc00});						
	
	this.render = true;
	  
    this.worldWidth = e_worldWidth;
	this.worldHeight = e_worldHeight;
	this.worldDepth = e_worldDepth;
	this.radius = parseFloat(_radius);

	this.xDirection = Math.random() *  15.0 - 1.0;
	this.yDirection = Math.random() * -10.0;
	this.zDirection = Math.random() * -30.0;

	this.position.x = - this.worldWidth/2 + this.radius*2	; //(Math.random()-0.5) * (this.worldWidth /2);
	this.position.y = this.worldHeight/2 - this.radius*2;
	this.position.z = 0 - this.radius*2;

	this._xDirChanged = false;
	this._yDirChanged = false;
	this._zDirChanged = false;
	this.counter = 0;
};



ParticleFor3D.prototype.newPosition = function(_bouncy, _friction, _gravity){


   if(this.render){
   
   
		// if the X direction changes
		if(((this.position.x + this.radius+2)  >= (this.worldWidth /2.0))  || ((this.position.x - this.radius-2)  <= -(this.worldWidth / 2.0))){
			this.xDirection *= -1.0;
			this._xDirChanged = true;
			//console.log("x changed");
		}
		// if the Y direction changes
		if(((this.position.y+this.radius+2)  >= (this.worldHeight/2.0)) || ((this.position.y - this.radius-2)  <= -(this.worldHeight/2.0))){
			this.yDirection *= -1.0;
			this._yDirChanged = true;
			//console.log("y changed");
		}
			// if the Y direction changes
		if(((this.position.z +this.radius+2)  >= 0) || ((this.position.z - this.radius-2)  <= -(this.worldDepth))){
			this.zDirection *= -1.0;
			this._zDirChanged = true;
			//console.log("z changed" + "z-pos: "+this.position.z);
			//console.log("posi-radius = " + ((this.position.z - this.radius)  <= -(this.worldDepth)));
			//console.log("posi+radius = " + ((this.position.z +this.radius)  >= 0))
		}


		if(_gravity){
			// gravity
			// give an impulse before the change of direction
				// limitation of acc range 				      // limitation of the area
			if((this.yDirection < 1.0 && this.yDirection > -2.0) && ((this.position.y - this.radius)  >= (-(this.worldHeight/2.0)))){
				this.yDirection -=0.2;
			}

			// acceleration
			// area! don't accelerate, when on ground
			if((this.position.y - this.radius)  > (-this.worldHeight/2)){
				if(this.yDirection > 0.0){
					this.yDirection *= 0.9;
					//console.log("upward");
					}
				else if((this.position.y - this.radius) >= -(this.worldHeight/2)){
					this.yDirection *= 1.1;
					//console.log("downward");
					}
			// when on ground and acc ~ 0 -> acc = 0
			}else if(this.xDirection < 0.05 && this.xDirection > -0.05){
				this.yDirection = 0.0;
				this.xDirection = 0.0;
				this.render = false;
				console.log("no acceleration" + "y-pos: "+ this.position.y + "y-direction: " + this.yDirection);
			}
		}else{
			if(    this.xDirection < 0.05 && this.xDirection > -0.05
				&& this.yDirection < 0.05 && this.yDirection > -0.05
				&& this.zDirection < 0.05 && this.zDirection > -0.05){
				this.yDirection = 0.0;
				this.xDirection = 0.0;
				this.render = false;
				console.log("no acceleration" + "y-pos: "+ this.position.y + "y-direction: " + this.yDirection);
			}		
		}

		// particle next position
		if(this.xDirection > 0.01 || this.xDirection < -0.01)
			this.position.x += this.xDirection;//-(this.worldWidth /2);
		if(this.yDirection > 0.01 || this.yDirection < -0.01){
			this.position.y += this.yDirection;//-(this.worldHeight /2);
			}
		if(this.zDirection > 0.01 || this.zDirection < -0.01){
			this.position.z += this.zDirection;//-(this.worldHeight /2);
			}
		


	  	// simulation of friction
		if(this.friction){
			this.xDirection *= 0.99;
			this.yDirection *= 0.99;
			this.zDirection *= 0.99;
		} 	



		// reduce acceleration, when a border was hit
		// change of direction is above
		// (reduce acceleration here, otherwise the particle would stuck on the postion of direction change)

		if(this._xDirChanged){
			this.xDirection *= _bouncy;
			this._xDirChanged = false;
		}
		if(this._yDirChanged){
			this.yDirection *= _bouncy;
			this._yDirChanged = false;
		}
		if(this._zDirChanged){
			this.zDirection *= _bouncy;
			this._zDirChanged = false;
		}
	
	}

};


ParticleFor3D.prototype.impulse = function(){
if(this.yDirection < 0.1 && this.yDirection > -0.1)
			this.yDirection = +(Math.random() * 20.0);
		else
			this.yDirection *= 15.0;
		
		if(this.xDirection < 0.1 && this.xDirection > -0.1){
			this.position.y  += 10.0;
			this.xDirection += ((Math.random() * 10.0) -5.0);
		}else
			this.xDirection *= 4.0;
		
		
		if(this.zDirection < 0.1 && this.zDirection > -0.1)
			this.zDirection += ((Math.random() * -30.0) +5.0);
		else
			this.zDirection *= 4.0;
			
	this.render = true;

}


