/*
scatterplot.js
Source code to a webpage that shows the interaction between 
happy life years and average life expectancy per country.
Dot sizes reflect the Gross Domestic Product of a country.
Rianne Schoon, 10742794

Sources and credits:
- http://happyplanetindex.org/resources/
- https://bl.ocks.org/mbostock/3887118
- Bas Chatel for the idea of a clickable legend
*/

// set height, width and margins
var margin = {top: 100, right: 200, bottom: 20, left: 30},
    width = 1000 - margin.left - margin.right,
    height = 580 - margin.top - margin.bottom;

// x-axis range
var x = d3.scale.linear()
    .range([0, width]);

// y-axis range
var y = d3.scale.linear()
    .range([height, 0]);

// enable dots to be colored
var color = d3.scale.category10();

// x-axis orientation
var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

// y-axis orientation
var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

// instantiate tip functionality
var tip = d3.tip()
  .attr('class', 'd3-tip')
  .offset([-10, 0])
  .html(function(d) {
    return "<strong>Country:</strong> <span style='color:midnightblue' style='font:tahoma'>" + d.Country + "</span>" + "<br>" +
    "<strong>GDP:</strong> <span style='color:midnightblue' style='font:sans serif'>" + "$" + d.GDPCapita + "</span>";
  });

// global: keep track of subselection of data
var clicked = 0;
var clickedData;

// enable data selection
function selectData(region) {
  // if no subset of data has been clicked yet: clicked subset of data pops out
  if (clicked == 0) {
    d3.selectAll(".dot").style("opacity", .3)
    // the "replace" part: no spaces in the class name (see line 147)
    d3.selectAll("." + region.replace(/\s/g, '')).style("opacity", 1);
    clickedData = region
    clicked = 1;
  }
  // if a selected data subset is clicked again: reset graph to no pop-outs
  else if (clicked == 1 && region == clickedData) {
    d3.selectAll(".dot").style("opacity", 1);
    clickedData = region
    clicked = 0;
  } 
  // if a data subset has been selected, but now another subset is clicked: 
  // switch pop-out to last clicked subset
  else if (clicked == 1 && region != clickedData) {
    d3.selectAll(".dot").style("opacity", .3);
    d3.selectAll("." + region.replace(/\s/g, '')).style("opacity", 1);
    clickedData = region
    clicked = 1;
  } 
};

// append svg to html body
var svg = d3.select(".chart").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// call tips, so that they appear when mouse hovers over the bar
svg.call(tip);

// get the data for the chart and check if it works
d3.json("dataWeek4.json", function(error, data) {
  if (error) console.log("Error with data.");

  // convert data from string (as in json) to integer (for display purposes)
  data.forEach(function(d) {
    d.happyLifeYears = +d.happyLifeYears;
    d.AvLifeExp = +d.AvLifeExp;
    d.GDPCapita = +d.GDPCapita;
  });

  // scale dots based on data
  var rscale = d3.scale.linear()
  .domain(d3.extent(data, function(d) { return d.GDPCapita; })).nice()
  .range([5,22]);

  // set axes division
  x.domain(d3.extent(data, function(d) { return d.happyLifeYears; })).nice();
  y.domain(d3.extent(data, function(d) { return d.AvLifeExp; })).nice();

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
      .text("Happy life years");

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
      .text("Average life expectancy (years)");
  
  // create graph title
  svg.append("g")
      .attr("class", "title")
    .append("text")
      .attr("x", (width + margin.left + margin.right) * .032)
      .attr("y", - margin.top / 1.7)
      .attr("dx", ".71em")
      .attr("font-size", "20px")
      .style("text-anchor", "begin")
      .text("Happy life years and average life expectancy related to world region and Gross Domestic Product");  

  // create dots
  svg.selectAll(".dot")
      .data(data)
    .enter().append("circle")
      .attr("class", function(d) { return "dot " + d.Region.replace(/\s/g, ''); })
      .attr("r", function(d) { return rscale(d.GDPCapita); })
      .attr("cx", function(d) { return x(d.happyLifeYears); })
      .attr("cy", function(d) { return y(d.AvLifeExp); })
      .style("fill", function(d) { return color(d.Region); })

      // tip-on-hovering functionality
      .on('mouseover', tip.show)
      .on('mouseout', tip.hide);

  // create legend
  var legend = svg.selectAll(".legend")
      .data(color.domain())
    .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function(d, i) { return "translate(" + (width + margin.right - 30) + "," + i * 25 + ")"; })

      // legend data selection functionality
      .on('click', function(region) { return selectData(region); })

  // legend colored rectangles
  legend.append("rect")
      .attr("class", function(d) { return "dot " + d.replace(/\s/g, ''); })
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", color);

  // legend text
  legend.append("text")
      .attr("x", -5)
      .attr("y", 8)
      .attr("dy", ".35em")
      .style("text-anchor", "end")
      .text(function (d) { return d; });
});
