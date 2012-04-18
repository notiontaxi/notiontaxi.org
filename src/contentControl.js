
$(function() {

	var offsetX = 20;
	var offsetY = 10;

	$('.tooltip').hover(function(e) {
		var html = $('<div id="current_tooltip"/>').load('./html/tooltip_firefox_webgl.html #container');
						
		$('body').append(html);
		$('#current_tooltip').hide().fadeIn(400);
		$('#current_tooltip').css('top', e.pageY + offsetY).css('left', e.pageX + offsetX);
			
	}, function() {
		$('#current_tooltip').remove();
	});
	
	$('.impressum').hover(function(e) {
		var html = $('<div id="current_tooltip"/>').load('./html/impressum.html #container');
						
		$('body').append(html);
		$('#current_tooltip').hide().fadeIn(400);
		$('#current_tooltip').css('top', e.pageY + offsetY -200).css('left', e.pageX + offsetX -520);
			
	}, function() {
		$('#current_tooltip').remove();
	});	
	
	
	
	$('.tooltip').mousemove(function(e) {
		$('#current_tooltip').css('top', e.pageY + offsetY).css('left', e.pageX + offsetX);
	});
	

});



