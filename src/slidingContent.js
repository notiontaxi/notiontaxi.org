

$(function() {
	
	var panelSum;
	var originalWidth, originalImgWidth,originalTitleSize,originalParSize;
	var actualWidth, actualImgWidth, actualTitleSize, actualParSize;
	var delta;
	var animationTime;
	var plusOffset;
	var curPanel;
	var panels;
	var $container;

	window.onload = start;
	
	function start() {
		$("#show").fadeOut();
		init();
	}
	
	function init(){
	
	
		panelSum			= $(".scrollContainer").children().size();

		originalWidth			= $(".panel").css("width");
		originalImgWidth			= $(".panel img").css("width");
		originalTitleSize		= $(".panel h1").css("font-size");
		originalParSize			= $(".panel p").css("font-size");

		delta	    = 395;

		animationTime		= 1000;
		actualWidth			= 500;
		actualImgWidth			= 480;
		actualTitleSize		= "19px";
		actualParSize			= "16px";

		curPanel = 1;

		panels				= $('.panel');
		$container			= $('#slider .scrollContainer');	
	
		$('#slider').data("show", true);
		$('#slider').data("keepScrolling", false);
		$("#slider").data("currentlyMoving", false);
		$container.css('width', (actualWidth * panels.length) + 100 );
	
		for (var i = 0; i < panels.length; i++)
		{
			var heightArticle = $("#"+panels[i].id).find('article').outerHeight();
			var heightPanel = $("#"+panels[i].id).height();
			
			var offsetTop = (heightPanel - heightArticle) / 2;
			$("#"+panels[i].id).find('article').data("offsetTop", offsetTop);			
			$("#"+panels[i].id).find('article').css("top", offsetTop);

		}
		
		addEventListeners();				
		growBigger("#panel_1", 10);	
	}

	function returnToNormal(element) {
	var offsetTop = $(element).find('article').data("offsetTop");
		$(element)
			.animate({ width: originalWidth, opacity : 0.5 },animationTime)
			.find("img")
			.animate({ width: originalImgWidth},animationTime)
		    .end()
			.find("h1")
			.animate({ fontSize: originalTitleSize },animationTime)
			.end()
			.find("p")
			.animate({ fontSize: originalParSize },animationTime)
			.end()
			.find("article")
			.animate({ top: offsetTop },animationTime);
	};
	
	function growBigger(element, time) {
	var offsetTop = $(element).find('article').data("offsetTop");
		$(element)
			.animate({ width: actualWidth, opacity : 1.0, top:0},time)
			.find("img")
			.animate({ width: actualImgWidth },time)
		    .end()
			.find("h1")
			.animate({ fontSize: actualTitleSize },time)
			.end()
			.find("p")
			.animate({ fontSize: actualParSize },time)
			.end()
			.find("article")
			.animate({ top: offsetTop -53},time);   // height shrinks 43px ... maybe that could be nicer
	}




	function change(direction) {
	   
		if((direction && !(curPanel < panelSum)) || (!direction && (curPanel <= 1))) { return false; }	
        
        if (($("#slider").data("currentlyMoving") == false)) {
            
			$("#slider").data("currentlyMoving", true);
			
			var next         = direction ? curPanel + 1 : curPanel - 1;
			var leftValue    = $(".scrollContainer").css("left");
			var movement	 = direction ? parseFloat(leftValue, 10) - delta : parseFloat(leftValue, 10) + delta;
		
			$(".scrollContainer")
				.stop()
				.animate({
					"left": movement
				},animationTime, function() {
					$("#slider").data("currentlyMoving", false);
				});
			
			returnToNormal("#panel_"+curPanel);
			growBigger("#panel_"+next, animationTime);
			
			curPanel = next;
		}
		
		if($('#slider').data("keepScrolling"))
			setTimeout(function(){change(direction);}, 200);
	}
	

	
	function loadXY(e_html, e_script, type) {
	
		$("#slider").stop().slideUp(500, 'swing' );
		$("#show").fadeIn();
		$("#slider").data("show", false);
		

			$('#fillThis').hide().load(e_html
								,function() {  
								
									jQuery.getScript(	e_script
														,function(){
															setTimeout(function(){
																	$('#fillThis').stop().slideDown(1000,'swing'
																	,function(){
																		window.currentContent.start();
																	}
															)},500);
															
															window.currentContent = type();
															
																
														}
									);	
								}
			);
	
	}
	
	function addEventListeners(){
	
	/*
		morphingPlane
		texturedCubes
		contentManipulation
		canvasManipulation
		particles3D
		particles2D
	*/
/*	
	// --- morphing plane
		$('#morphingPlanes').click(function() {
			 // load dependencies
			if(!window.MorphPlane){
				jQuery.getScript(	'./goTo/morphingPlanes/src/MorphPlane.js',function(){
					console.log("class MorphPlane loaded")
					loadXY('./goTo/morphingPlanes/index.html #fillWithThis', './goTo/morphingPlanes/src/MorphingPlanes.js',  function(){return new MorphingPlanes();});
				});
		}else		
			loadXY('./goTo/particles2D/index.html #fillWithThis', './goTo/particles2D/src/Particles2D.js',  function(){return new Particles2D();});
					
			return false;
		});
	// ---
*/	
	
	// --- morphing plane
		$('#morphingPlane').click(function() {
			 // load dependencies
				
			// create content and slide it down
			loadXY('./goTo/morphingPlane/content.html #fillWithThis', './goTo/morphingPlane/src/MorphingPlane.js',  function(){return new MorphingPlane();});
					
			return false;
		});
	// ---	
	
	// --- video texture
		$('#videoTexture').click(function() {
			 // load dependencies
				
			// create content and slide it down
			loadXY('./goTo/videoTexture/content.html #fillWithThis', './goTo/videoTexture/src/VideoTexture.js',  function(){return new VideoTexture();});
					
			return false;
		});
	// ---		
	
	// --- content manipulation
		$('#contentManipulation').click(function() {
			 // load dependencies
			if(!window.FilterColor)
				jQuery.getScript(	'./goTo/contentManipulation/src/FilterColor.js',function(){console.log("class FilterColor loaded")});
				
			// create content and slide it down
			loadXY('./goTo/contentManipulation/content.html #fillWithThis', './goTo/contentManipulation/src/ContentManipulation.js',  function(){return new ContentManipulation();});
					
			return false;
		});
	// ---	
	
	// --- canvas manipulation
		$('#canvasManipulation').click(function() {
			 // load dependencies
			if(!window.Draggable)
				jQuery.getScript(	'./goTo/canvasManipulation/src/Draggable.js',function(){console.log("class Draggable loaded")});
				
			// create content and slide it down
			loadXY('./goTo/canvasManipulation/content.html #fillWithThis', './goTo/canvasManipulation/src/CanvasManipulation.js',  function(){return new CanvasManipulation();});
					
			return false;
		});
	// ---
	
	// --- particles 3D
		$('#particles3D').click(function() {
			 // load dependencies
			 
			 console.log(!window.ParticleFor3D);
			 

				jQuery.getScript(	'./goTo/particles3D/src/ParticleFor3D.js',function(){
					console.log("class Particles loaded");
					loadXY('./goTo/particles3D/content.html #fillWithThis', './goTo/particles3D/src/Particles3D.js',  function(){return new Particles3D();});
				});

	
			return false;
		});
	// ---	
	
	// --- particles 2D
		$('#particles2D').click(function() {
			 // load dependencies
			if(!window.ParticleFor2D){
				jQuery.getScript(	'./goTo/particles2D/src/ParticleFor2D.js',function(){
					console.log("class Particles loaded")
					loadXY('./goTo/particles2D/content.html #fillWithThis', './goTo/particles2D/src/Particles2D.js',  function(){return new Particles2D();});
				});
		}else		
			loadXY('./goTo/particles2D/content.html #fillWithThis', './goTo/particles2D/src/Particles2D.js',  function(){return new Particles2D();});
					
			return false;
		});
	// ---		
	
		$('#slider').hover(
			function(){
				;
			},
			function(){
				$('#slider').data("keepScrolling", false);
			}	
		);
		
		$('#slider').mousemove(
			function(e){
				var relPos = e.pageX - $(this).position().left;
				if(relPos < 250 && relPos > 1){
					$('#slider').data("keepScrolling", true);
					change(false);
				}else if(relPos > 750 && relPos < 999){
					change(true);
					$('#slider').data("keepScrolling", true);
				}else
					$('#slider').data("keepScrolling", false);
			}
		);
				
		$(window).keydown(function(event){
		  switch (event.keyCode) {
				case 13: //enter
					change(true);
					break;
				case 32: //space
					change(true);
					break;
			case 37: //left arrow
					change(false);
					break;
				case 39: //right arrow
					change(true);
					break;
		  }
		});
				
		$("#show").click(function() {
			if(!!window.currentContent){
				window.currentContent.stop();
				$("#fillThis").slideUp(	800,'swing'
										,function(){
											$("#slider").stop().slideDown(1000, 'swing');
											$("#slider").data("show", true);
										
											$("#fillThis").empty();										
											window.currentContent = null;
										}
									);
			$("#show").fadeOut();						
			}
		});	

	}
	

	
});