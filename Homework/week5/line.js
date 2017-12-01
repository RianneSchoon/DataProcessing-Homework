/*
line.js
Source code to a webpage that shows the minimum, maximum, 
and mean temperature in de Bilt in 1996 and in 2016.

Rianne Schoon, 10742794

Sources and credits:
- Jan proposed the data structure in this assignment
- https://bl.ocks.og/rmbostock/3884955
- http://www.d3noob.org/2014/07/my-favourite-tooltip-method-for-line.html
*/

// set height, width and margins
var margin = {top: 100, right: 30, bottom: 20, left: 30},
  width = 900 - margin.left - margin.right,
  height = 550 - margin.top - margin.bottom;

// Parse the date
var createDate = d3.time.format("%Y%m%d").parse; 

// x-axis range
var x = d3.time.scale()
  .range([0, width]);

// y-axis range
var y = d3.scale.linear()
  .range([height, 0]);

// enable lines to be colored
var color = d3.scale.category10();

// x-axis orientation
var xAxis = d3.svg.axis()
  .scale(x)
  .orient("bottom")
  // credit to Laura for the following line:
  .tickFormat(d3.time.format("%B"));

// y-axis orientation
var yAxis = d3.svg.axis()
  .scale(y)
  .orient("left");

// append svg to html body
var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var lineSvg = svg.append("g");

var focus = svg.append("g")
    .style("display", "none");

// drawline function
var drawLine = d3.svg.line()
	.x(function(d) { return x(createDate(d.date)); })
	.y(function(d) { return y(+d.temp) });

// function to draw lines from restructured data
function dataStructDraw(year) {
  
  // restructured data array
  dataStruct = []

  // 'name' is the temperature category (min/max/mean)
  dataNames.forEach(function(name) {

    // temperature values
    var temp = []

    // fill arrays
    for (val in year[name]) {
      temp.push({date : val, temp : year[name][val]})
    };
    dataStruct.push({id : name, year : temp});
  });

  // create lines on svg
  var lines = svg.selectAll(".lines")
    .data(dataStruct)
    .enter().append("g")
      .attr("class", "lines");

  // draw lines
  lines.append("path")
      .attr("class", "line")
      .attr("stroke-linejoin", "round")
      .attr("stroke-linecap", "round")
      .attr("stroke-width", "1")
      .attr("d", function(d) { return drawLine(d.year); })
      .style("stroke", function(d) { return "steelblue" });

  // cross-hair functionality: data to left of mouse
  var hairDate = d3.bisector(function(d) { return d.date; }).left;

  // append the circle at the intersection
  focus.append("circle")
      .attr("class", "y")
      .style("fill", "none")
      .style("stroke", "blue")
      .attr("r", 4);
console.log(year);
  // append the rectangle to capture mouse
  svg.append("rect")
      .attr("width", width)
      .attr("height", height)
      .style("fill", "none")
      .style("pointer-events", "all")
      .on("mouseover", function() { focus.style("display", null); })
      .on("mouseout", function() { focus.style("display", "none"); })
      .on("mousemove", mousemove);

    // cross-hair funcitonality
  function mousemove() {
    var x0 = x.invert(d3.mouse(this)[0]),
      i = hairDate(year, x0, 1),
      d0 = year[i - 1],
      d1 = year[i],
      d = x0 - d0.date > d1.date - x0 ? d1 : d0;

    // mouse focus
    focus.select("circle.y")
      .attr("transform", "translate(" + x(d.year) + "," + y(d.year) + ")");
  }
};

// load datasets before display (http://bl.ocks.org/mapsam/6090056)
queue()
	.defer(d3.json, 'temp1996.json')
	.defer(d3.json, 'temp2016.json')
	.await(makeGraph);

// get the data for the chart and errorcheck
function makeGraph(error, data1996, data2016) {
  if (error) console.log("Error with data.");

  // array of 'main keys' (line categories) (same in both datasets)
  dataNames = Object.keys(data2016);

  // array of 'date keys' (x-axis values) (different between datasets)
  dataDates1996 = Object.keys(data1996[dataNames[0]]);
  dataDates2016 = Object.keys(data2016[dataNames[0]]);

  // min/max temperature arrays will be used to determine y-axis range
  dataMin = [];
  dataMax = [];

  // put min/max temps of both datasets in the arrays
  for (i = 0; i < dataDates1996.length; i++) {

    // fill min array with minima as integers
    dataMin.push(+data1996[dataNames[1]][dataDates1996[i]]);
    dataMin.push(+data2016[dataNames[1]][dataDates2016[i]]);

    // fill max array with maxima as integers
    dataMax.push(+data1996[dataNames[0]][dataDates1996[i]]);
    dataMax.push(+data2016[dataNames[0]][dataDates2016[i]]);

    // dates are javascript date objects
    dataDates1996[i] = createDate(dataDates1996[i]);
    dataDates2016[i] = createDate(dataDates2016[i]);
  }; 

  // set axes division (based on 1996 dates - but that is fine because both were leap years);
  x.domain(d3.extent(dataDates1996, function(d) { return d; }));
  y.domain([d3.min(dataMin, function(d) { return d; }), d3.max(dataMax, function(d) { return d; })]).nice();

  // create x-axis and title
  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
    .append("text")
      .attr("class", "label")
      .attr("x", width)
      .attr("y", -6)
      .style("text-anchor", "end")
      .text("Month");

  // create y-axis and title
  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("class", "label")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Min temperature in degrees Celcius");
  
  // create graph title
  svg.append("g")
      .attr("class", "title")
    .append("text")
      .attr("x", (width + margin.left + margin.right) * .09)
      .attr("y", - margin.top / 1.7)
      .attr("dx", ".71em")
      .attr("font-size", "20px")
      .style("text-anchor", "begin")
      .text("Minimum, maximum, and mean temperature in De Bilt in 1996 and 2016");  

  dataStructDraw(data1996);
  dataStructDraw(data2016);
};

//   I tried to make a legend and to make it clickable, like the previous assignment.
//   However, wednesday Jan suggested to restructure the data. I had one functional line in my graph,
//   but with the new data I had to start over from scratch. 
//   In addition, the new data made things unbelievably complicated. 
//   I still do not see how Jan thought this structure was more advantageous.
//
//   I do not want to blame him, but due to the retake of the programming2 exam, I did not have the possibility
//   to figure out how to work with this new dataset. Therefore, the next lines of code are not functional.
//   However, I decided to let them stay here, because with another data structure they are easily implemented.
//   I plan on doing that in the weekend, with my original datastructure, so that i still learn from this assignment.

  // // create legend
  // var legend = svg.selectAll(".legend")
  //     .data(color.domain())
  //   .enter().append("g")
  //     .attr("class", "legend")
  //     .attr("transform", function(d, i) { return "translate(" + (width + margin.right - 30) + "," + i * 25 + ")"; })

  //     // legend data selection functionality
  //     .on('click', function(region) { return selectData(region); })

  // // legend colored rectangles
  // legend.append("rect")
  //     .attr("class", function(d) { return "dot " + d.replace(/\s/g, ''); })
  //     .attr("width", 18)
  //     .attr("height", 18)
  //     .style("fill", color);

  // // legend text
  // legend.append("text")
  //     .attr("x", -5)
  //     .attr("y", 8)
  //     .attr("dy", ".35em")
  //     .style("text-anchor", "end")
  //     .text(function (d) { return d; });

// // global: keep track of subselection of data
// var clicked = 0;
// var clickedData;

// // enable data selection
// function selectData(region) {
//   // if no subset of data has been clicked yet: clicked subset of data pops out
//   if (clicked == 0) {
//     d3.selectAll(".dot").style("opacity", .3)
//     // the "replace" part: no spaces in the class name (see line 147)
//     d3.selectAll("." + region.replace(/\s/g, '')).style("opacity", 1);
//     clickedData = region
//     clicked = 1;
//   }
//   // if a selected data subset is clicked again: reset graph to no pop-outs
//   else if (clicked == 1 && region == clickedData) {
//     d3.selectAll(".dot").style("opacity", 1);
//     clickedData = region
//     clicked = 0;
//   } 
//   // if a data subset has been selected, but now another subset is clicked: 
//   // switch pop-out to last clicked subset
//   else if (clicked == 1 && region != clickedData) {
//     d3.selectAll(".dot").style("opacity", .3);
//     d3.selectAll("." + region.replace(/\s/g, '')).style("opacity", 1);
//     clickedData = region
//     clicked = 1;
//   } 
