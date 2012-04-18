/* Florian Wokurka (2011)
 * 
 * Feel free to use.
 * 
 * Special thanks to Jan Monschke 4 answering my b00n-questions ;)  
 * Thanks to http://css3-html5.de/ for information and motivation :)
 * */
 

(function () {


	var myCanvas;
	var myCanvasContext;

	var canvasWidth;
	var canvasHeight;

	var quadArray;
	var maxParticles;
	var grow;

	var pause;

	var particleHeight;
	var particleWidth;

	var gravity;
	var friction;
	var bouncy;


	init();						
	addEventListeners();		 
	window.onload = loop();		



	function loop(){

		// overpaint the canvas
		myCanvasContext.fillStyle = "rgba(0,0,0,0.1)";
		myCanvasContext.fillRect(0,0,canvasWidth,canvasHeight);
		
		
		// rule for the next call
		if(pause){
			setTimeout(loop, 500);
			return;
		}else
			setTimeout(loop, 25);
		
		
		// paint every particle in the array
		for(var index in quadArray){
			myCanvasContext.fillStyle = "#009900"; //quadArray[index].color;
			myCanvasContext.fillRect(quadArray[index].xPosition,    quadArray[index].yPosition,    quadArray[index].width,   quadArray[index].height);
			quadArray[index].newPosition(bouncy, friction, gravity);
		}

		
		// add "grow" particles to the array until it has reached the size of maxParticles
		if(quadArray.length < maxParticles){
			for(var i = 0; i < grow; i++ )
				quadArray[quadArray.length] = new Particle(particleWidth, particleHeight, canvasWidth, canvasHeight); // variable array :)
		}
		// -> call the first time 
		
		
		// remove "grow" particles to the array until it has reached the size of maxParticles
		else if(quadArray.length > maxParticles){
			for(var i = 0; i < grow; i++ )  // same time for removing as for adding
				if(quadArray.length > maxParticles) // but dont remove more than wanted!
					 quadArray.pop();// = remove Particle(); // variable array :)
		}
	}


	function impulse(){
		for(var i in quadArray)
			quadArray[i].impulse();	
	};


	function init(){
		
		if(!myCanvas){ // execute only one time!
		console.log("executed");
		myCanvas = document.getElementById("myCanvas");
		myCanvasContext = myCanvas.getContext("2d");

		canvasWidth = myCanvas.width;
		canvasHeight = myCanvas.height;
		}

		quadArray = new Array();
		maxParticles = document.getElementById("partMaxNumOutput").firstChild.nodeValue;
		grow = document.getElementById("PartIncreaseOutput").firstChild.nodeValue;
		
		pause = false;
		
		particleHeight = document.getElementById("partHeight").value;
		particleWidth  = document.getElementById("partWidth").value;	
		
		gravity = document.getElementById("checkBoxGravity").checked;
		friction = document.getElementById("checkBoxFriction").checked;
		bouncy = document.getElementById("partBouncingOutput").firstChild.nodeValue;
	}



	function addEventListeners(){

		document.getElementById("PartMaxNum").addEventListener("change",function(e) {
			maxParticles = parseInt(e.target.value);
		},false);

		document.getElementById("PartIncrease").addEventListener("change",function(e) {
			grow = parseInt(e.target.value);
		},false);

		document.getElementById("PartBouncing").addEventListener("change",function(e) {
			bouncy = (parseFloat(e.target.value)).toFixed();
		},false);

		document.getElementById("partHeight").addEventListener("change",function(e) {
			var newHeight = parseInt(e.target.value);
			for(i in quadArray){
				quadArray[i].height = newHeight;
			}
			particleHeight =  newHeight;
		},false);

		document.getElementById("partWidth").addEventListener("change",function(e) {
			var newWidth = parseInt(e.target.value);
			for(i in quadArray){
				quadArray[i].width = newWidth;
			}
			particleWidth = newWidth;
		},false);

		document.getElementById("checkBoxGravity").addEventListener("change",function(e) {
			gravity = !gravity;
		},false);

		document.getElementById("checkBoxFriction").addEventListener("change",function(e) {
			friction = !friction;
		},false);

		document.getElementById("btnImpulse").addEventListener("click",function() {
			impulse();
		},false);

		document.getElementById("btnPause").addEventListener("click",function() {
			pause = !pause;
		},false);

		document.getElementById("btnReset").addEventListener("click",function() {
			init();
		},false);

	}

})();
