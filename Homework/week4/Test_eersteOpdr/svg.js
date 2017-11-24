// - add the missing buckets in the legend
// - fill in the colors and text areas. 
// The colors for the legend are as followed: 
// [‘#ccece6’,’#99d8c9’,’#66c2a4’,’#41ae76’,’#238b45’,’#005824’].

// load SVG
svg = d3.xml("test.svg", "image/svg+xml", function(error, xml) {
	if (error) throw error;    
  document.body.appendChild(xml.documentElement)

var color1 = d3.select("#kleur1").style("fill", "#ccece6");
var color2 = d3.select("#kleur2").style("fill", "#99d8c9");
var color3 = d3.select("#kleur3").style("fill", "#66c2a4");
var color4 = d3.select("#kleur4").style("fill", "#41ae76");
var color5 = d3.select("#kleur5").style("fill", "#238b45");
var color6 = d3.select("#kleur6").style("fill", "#005824");
var color7 = d3.select("#kleur7").style("fill", "#bbbec1");

var text1 = d3.select("svg").append("g");

  text1.append("rect")
  	.attr("id", "tekst1")
  	.attr("x", "46.5")
  	.attr("y", "13.5")
  	.attr("class", "st2")
  	.attr("width", "119.1")
  	.attr("height", "29");
  text1.append("text")
  	  .attr("x", 50)
  	  .attr("y", 31)
      .attr("font-size", "15px")
	  .attr("color", "black")
  	  .text("100");

var text2 = d3.select("svg").append("g");

  text2.append("rect")
  	.attr("id", "tekst1")
  	.attr("x", "46.5")
  	.attr("y", "56.9")
  	.attr("class", "st2")
  	.attr("width", "119.1")
  	.attr("height", "29");
  text2.append("text")
  	.attr("x", 50)
    .attr("y", 74.4)
    .attr("font-size", "15px")
	.attr("color", "black")
  	.text("1000");

var text3 = d3.select("svg").append("g");

  text3.append("rect")
  	.attr("id", "tekst1")
  	.attr("x", "46.5")
  	.attr("y", "96.8")
  	.attr("class", "st2")
  	.attr("width", "119.1")
  	.attr("height", "29");
  text3.append("text")
  	.attr("x", 50)
    .attr("y", 113.3)
    .attr("font-size", "15px")
	.attr("color", "black")
  	.text("10000");

var text4 = d3.select("svg").append("g");

  text4.append("rect")
  	.attr("id", "tekst1")
  	.attr("x", "46.5")
  	.attr("y", "138.7")
  	.attr("class", "st2")
  	.attr("width", "119.1")
  	.attr("height", "29");
  text4.append("text")
  	.attr("x", 50)
    .attr("y",157.2)
    .attr("font-size", "15px")
	.attr("color", "black")
  	.text("100000");

var text5 = d3.select("svg").append("g");

  text5.append("rect")
  	.attr("id", "tekst1")
  	.attr("x", "46.5")
  	.attr("y", "178.7")
  	.attr("class", "st2")
  	.attr("width", "119.1")
  	.attr("height", "29");
  text5.append("text")
  	.attr("x", 50)
    .attr("y",197.2)
    .attr("font-size", "15px")
	.attr("color", "black")
  	.text("1000000");

var text6 = d3.select("svg").append("g");

  text6.append("rect")
  	.attr("id", "tekst1")
  	.attr("x", "46.5")
  	.attr("y", "218.7")
  	.attr("class", "st2")
  	.attr("width", "119.1")
  	.attr("height", "29");
  text6.append("text")
  	.attr("x", 50)
    .attr("y",237.2)
    .attr("font-size", "15px")
	.attr("color", "black")
  	.text("10000000");

var text7 = d3.select("svg").append("g");

  text6.append("rect")
    .attr("id", "tekst1")
    .attr("x", "46.5")
    .attr("y", "258.7")
    .attr("class", "st2")
    .attr("width", "119.1")
    .attr("height", "29");
  text6.append("text")
    .attr("x", 50)
    .attr("y",277.2)
    .attr("font-size", "15px")
  .attr("color", "black")
    .text("Unknown Data");
});
