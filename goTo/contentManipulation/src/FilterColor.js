/*
Filter Color

Florian Wokurka (2011)
Feel free to use.

*/


(function () {

window.FilterColor = FilterColor;

function FilterColor(e_red, e_green, e_blue, e_filterRange){
	
	this.red = 0;
	this.green = 0
	this.blue = 0;
	this.redMin = 0;
	this.redMax = 0;
	this.greenMin = 0;
	this.greenMax = 0;
	this.blueMin = 0;
	this.blueMax = 0;
	this.filterRange = 0;
	
	this.setFilterRange(e_filterRange);
	this.setRGBValues(e_red, e_green, e_blue);
	
}

FilterColor.prototype.setRGBValues = function(e_red, e_green, e_blue){

	// check parameters
	if(e_red)
		this.red = e_red;
	else
		this.red = 0;
		
	if(e_green)
		this.green = e_green;
	else
		this.green = 0;
	
	if(e_blue)
		this.blue = e_blue;
	else
		this.blue = 0;
		
	// set min- and max-values	
	this.setMinMaxValues();		
}

FilterColor.prototype.setFilterRange = function(e_filterRange){

	if(e_filterRange)
		this.filterRange = e_filterRange;
	else
		this.filterRange = 20;
	
	this.setMinMaxValues();

}

FilterColor.prototype.setMinMaxValues = function(){
	this.redMin = FilterColor.getMinValue(this.red, this.filterRange);
	this.redMax = FilterColor.getMaxValue(this.red, this.filterRange);
	this.greenMin = FilterColor.getMinValue(this.green, this.filterRange);
	this.greenMax = FilterColor.getMaxValue(this.green, this.filterRange);
	this.blueMin = FilterColor.getMinValue(this.blue, this.filterRange);
	this.blueMax = FilterColor.getMaxValue(this.blue, this.filterRange);
};

FilterColor.getMinValue = function(e_color, e_filterRange){
var minValue = e_color - e_filterRange;
	if(minValue < 0)
		minValue = 0;
return minValue;
}


FilterColor.getMaxValue = function(e_color, e_filterRange){
var maxValue = e_color + e_filterRange;
	if(maxValue > 255)
		maxValue = 255;
		
return maxValue;
}

FilterColor.prototype.getMinMaxValues = function(){
return new Array(this.redMin,this.redMax,this.greenMin,this.greenMax,this.blueMin,this.blueMax);
}



})();