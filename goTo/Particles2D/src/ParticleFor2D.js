/* Florian Wokurka (2011)
 * 
 * Feel free to use.
 * */
 

window.ParticleFor2D = ParticleFor2D;
     // -> draw elemnt in main


function ParticleFor2D(_width, _height, e_worldWidth, e_worldHeight){

    this.worldWidth = e_worldWidth;
	this.worldHeight = e_worldHeight;
	this.width = _width;
	this.height = _height;
	this._xDirection = Math.random() * 4 - 2;
	this._yDirection = Math.random() * 10;
	this.xPosition = this.worldWidth / 2;
	this.yPosition = 0;
	this._xDirChanged = false;
	this._yDirChanged = false;
	this.render = true;
};



ParticleFor2D.prototype.newPosition = function(_bouncy, _friction, _gravity){
   
   if(this.render){
		// if the X direction changes
		if(this.xPosition >= (this.worldWidth  - this.width) || this.xPosition < 0){
			this._xDirection = (this._xDirection * -1);
			this._xDirChanged = true;
		}
		// if the Y direction changes
		if(this.yPosition >= (this.worldHeight  - this.height) || this.yPosition < 0){
			this._yDirection = (this._yDirection * -1);
			this._yDirChanged = true;
		}

		
		if(_gravity){
			// gravity
			// give an impulse before the change of direction
				// limitation of acc range 				      // limitation of the area
			if((this._yDirection < 1 && this._yDirection > -2) && this.yPosition <= (this.worldHeight  - this.height)){
				this._yDirection +=0.2;
			}

			// acceleration
			// area! don't accelerate, when on ground
			if(this.yPosition <= (this.worldHeight  - this.height - 1)){
				if(this._yDirection < 0)
					this._yDirection *= 0.9;
				else if(this.yPosition < this.worldHeight - this.height)
					this._yDirection *= 1.1;
			// when on ground an acc ~ 0 -> acc = 0
			}else if(this._yDirection < 0.2 && this._yDirection > -0.2){
				this._yDirection = 0;
				this._xDirection = 0;
				this.render = false;
				console.log("no acceleration");
			}

		}

		// particle next position
		this.xPosition += this._xDirection;
		this.yPosition += this._yDirection;
		
		
		
		if(_friction){
			this._xDirection *= 0.99;
			this._yDirection *= 0.99;
		}

		// reduce acceleration, when a border was hit
		// change of direction is above
		// (reduce acceleration here, otherwise the particle would stuck on the postion of direction change)
		if(this._xDirChanged){
			this._xDirection *= _bouncy;
			this._xDirChanged = false;
		}
		if(this._yDirChanged){
			this._yDirection *= _bouncy;
			this._yDirChanged = false;
		}
	}
}


ParticleFor2D.prototype.impulse = function(){
		this.yPosition -= 10;
		this._yDirection = -(Math.random() * 20);
		this._xDirection += ((Math.random() * 10) -5);
		this.render = true;
}
