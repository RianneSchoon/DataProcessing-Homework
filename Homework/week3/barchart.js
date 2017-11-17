/*
barchart.js
Source code to a webpage that shows the monthly rainfall in De Bilt in 2015.

Rianne Schoon, 10742794

Sources and credits:
- http://bl.ocks.org/Caged/6476579
*/

// set height, width and margins
var margin = {top: 40, right: 20, bottom: 50, left: 60},
  width = 800 - margin.left - margin.right,
  height = 500 - margin.top - margin.bottom;

// x-axis range
var x = d3.scale.ordinal()
  .rangeRoundBands([0,width], .1);

// y-axis range
var y = d3.scale.linear()
  .range([height, 0]);

// x-axis orientation
var xAxis = d3.svg.axis()
  .scale(x)
  .orient("bottom");

// y-axis
var yAxis = d3.svg.axis()
  .scale(y)
  .orient("left");

// instantiate tip functionality
var tip = d3.tip()
  .attr('class', 'd3-tip')
  .offset([-10, 0])
  .html(function(d) {
    return "<strong>Rain:</strong> <span style='color:red'>" + d.rain + " mm</span>";
  })

// append svg to html body
var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// call tips, so that they appear when mouse hovers over the bar
svg.call(tip);

// get the data for the chart and check if it works
d3.json("barchart.json", function(error, data) {
  if (error) console.log("Error with data.");

  // convert data from string (as in json) to integer (to display)
  data.forEach(function(d) {
    d.rain = +d.rain;
  });

  // set axes division
  x.domain(data.map(function(d) { return d.date; }));
  y.domain([0, d3.max(data, function(d) {return d.rain; })]);

  // create x-axis and title
  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
    .append("text")
      .attr("x", width / 2)
      .attr("y", 35)
      .attr("dx", ".71em")
      .attr("font-size", "17px")
      .style("text-anchor", "end")
      .text("Month in 2014");
  
  // create y-axis and title
  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", height - 500)
      .attr("y", - margin.left /1.5)
      .attr("dy", ".71em")
      .attr("font-size", "17px")
      .style("text-anchor", "end")
      .text("Average rainfall in millimeter");
  
  // create text for data source
  svg.append("g")
      .attr("class", "source")
      .attr("transform", "translate(0," + height + ")")
    .append("text")
      .attr("x", width)
      .attr("y", 47)
      .attr("dx", ".71em")
      .attr("font-size", "10px")
      .style("text-anchor", "end")
      .text("Data source: http://projects.knmi.nl/klimatologie/daggegevens/selectie.cgi");

  // create graph title
  svg.append("g")
        .attr("class", "title")
      .append("text")
        .attr("x", width / 1.4)
        .attr("y", margin.top)
        .attr("dx", ".71em")
        .attr("font-size", "25px")
        .style("text-anchor", "end")
        .text("Average amount of rain in De Bilt in 2015");

  // create bars
  svg.selectAll(".bar")
      .data(data)
    .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return x(d.date); })
      .attr("width", x.rangeBand())
      .attr("y", function(d) { return y(d.rain); })
      .attr("height", function(d) { return height - y(d.rain); })

      // tip-on-hovering functionality
      .on('mouseover', tip.show)
      .on('mouseout', tip.hide);
});
