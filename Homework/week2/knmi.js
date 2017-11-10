/* 
Source code to a webpage that shows the weather in De Bilt in 2014. 
Rianne Schoon, 10742794

sources and credits for hints:
- https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial
- aquiring data via innerHTML: Stephan de Graaf
- lay-out of webpage (scaling data and graph axes): Bas Chatel
*/

// get wheather data from html
var data = document.getElementById("rawdata").innerHTML;

// create array for weather data
var dayArray = [];
var tempArray = [];

// fill the array with the day of the year and mean temperature
var lines = data.split("\n");
for (var i = 0; i < lines.length; i++) {
	curr = lines[i].split(',');
	formatDate = String(curr[0].slice(0, 4) + "-" + curr[0].slice(4, 6) + "-" + curr[0].slice(6, 8));
	dayArray.push(new Date(formatDate));
	tempArray.push(Number(curr[1]));
} 

// figure characteristics
var range = {width: 900, height: 600};
var canvasMargin = {left: 75, bottom: 55, top: 30};

// for scalability
var tempExtremes = {high: 264, low:-12};
var yearDays = dayArray.length;

// labels x-axis
var xLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dec"];
var yearMonths = xLabels.length;

// function to scale dates to canvas
function createTransformX(date) {
	x = ((range.width - canvasMargin.left) / yearDays) * date + canvasMargin.left;
	return x;
}

// function to scale temperature to canvas 
function createTransformY(temperature) {
	// y = temperature * -1 + range.min - canvasMargin.bottom - temperatureExtremes.low;
	var yScaling = (range.height - canvasMargin.bottom - canvasMargin.top) / (tempExtremes.high - tempExtremes.low);
	var y =  yScaling * temperature * -1 + (range.height - canvasMargin.bottom);
	return y;
}

// canvas
function draw() {
	var canvas = document.getElementById('myCanvas');
	if (canvas.getContext) {
		var ctx = canvas.getContext('2d');

		// graph axes
		ctx.beginPath();
		// y axis
		ctx.moveTo(canvasMargin.left, canvasMargin.top);
		ctx.lineTo(canvasMargin.left, range.height - canvasMargin.bottom);
		// line at zero temperature
		ctx.moveTo(canvasMargin.left, range.height - canvasMargin.bottom);
		ctx.lineTo(range.width, range.height - canvasMargin.bottom)
		// font for labels
		ctx.font = 'bold 17px Times New Roman';
		ctx.closePath();
		ctx.stroke();

		// ticks x-axis
		for (var j = 0; j < yearMonths + 1; j++) {
			
			// tick
			var startTickX = ((range.width - canvasMargin.left) / yearMonths) * [j] + canvasMargin.left;	
			ctx.beginPath();
			ctx.moveTo(startTickX, range.height - canvasMargin.bottom);
			ctx.lineTo(startTickX, range.height - canvasMargin.bottom + 10);
			// label
			ctx.fillText(xLabels[j], startTickX + 30, range.height - canvasMargin.bottom + 20);
			ctx.stroke();
			ctx.closePath();
		}

		// ticks y-axis: I want 10 of them
		var yTickNum = 10;
		for (var k = 1; k < yTickNum + 1; k++) {
			
			// tick
			var startTickY = ((range.height - canvasMargin.top - canvasMargin.bottom) / yTickNum) * [k] * -1 + (range.height - canvasMargin.bottom)
			ctx.beginPath();
			ctx.moveTo(canvasMargin.left, startTickY);
			ctx.lineTo(canvasMargin.left - 10, startTickY);
			// label
			var yLabelStep = (tempExtremes.high - tempExtremes.low) / yTickNum;
			ctx.fillText(Math.round(yLabelStep * k), canvasMargin.left - 40, startTickY);
			ctx.stroke();
			ctx.closePath();
		}

		// data line (transformed)
		ctx.beginPath();
		ctx.shadowOfsettX = 4;
		ctx.shadowOfsettY = 4;
		ctx.shadowBlur = 2;
		ctx.shadowColor = 'rgba(0,0,255,.5)';
		ctx.moveTo(createTransformX([0]), createTransformY(tempArray[0]));
		for (var i = 1; i < yearDays; i++) {
			ctx.lineTo(createTransformX([i]), createTransformY(tempArray[i]));
		}
		ctx.stroke();
		ctx.closePath();

		// no longer shadows
		ctx.shadowOfsettX = 0;
		ctx.shadowOfsettY = 0;
		ctx.shadowBlur = 0;

		// graph title
		ctx.font = 'bold 35px Times New Roman';
		ctx.fillText('Wheather in De Bilt in 2014', (range.width / 4), canvasMargin.top);

		// data source
		ctx.font = 'bold 14px Times New Roman';
		ctx.fillText('Data source: http://projects.knmi.nl/klimatologie/daggegevens/selectie.cgi', canvasMargin.left, range.height - (canvasMargin.bottom / 4));
		
		// label x-axis
		ctx.font = 'bold 25px Times New Roman';
		ctx.fillText('Month', 0.93 * (range.width - canvasMargin.left), range.height - (canvasMargin.bottom / 7));

		// label y-axis
		ctx.font = 'bold'
		ctx.translate(-canvasMargin.left *1.3, 0.77 * range.height);
		ctx.rotate(270 * Math.PI / 180);
		ctx.fillText('Mean temperature in degrees Celsius', canvasMargin.left / 2, 0.2* range.height);
	};
}

// draw graph - axes, labels, titel
draw();
