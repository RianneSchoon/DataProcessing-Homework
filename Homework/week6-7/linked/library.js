// G map dimensions setup
function setupMap (width,height) {

  console.log("setupMap aangeroepen!");

  projection = d3.geo.mercator()
    .translate([(width/2), (height/2)])
    .scale( width / 2 / Math.PI);

  // to draw countries
  path = d3.geo.path().projection(projection);

  // map can be zoomed and clicked everywhere
  svg = d3.select("#container").append("svg")
      .attr("width", width)
      .attr("height", height)
      .call(zoom)
      .on("click", click)
      .append("g");
  g = svg.append("g");
}

// GET THE DATA HERE IN THE ORIGINAL CODE

function drawTopo(countries) {

  //  draw equator
  g.append("path")
   .datum({type: "LineString", coordinates: [[-180, 0], [-90, 0], [0, 0], [90, 0], [180, 0]]})
   .attr("class", "equator")
   .attr("d", path);

  // each country has own g element
  var country = g.selectAll(".country").data(countries);

  // each country on g element on the map
  country.enter().insert("path")
      // class is country name
      .attr("class", function(d, i) { return "country" + " " + d.properties.name; })
      .attr("d", path)
      .attr("id", function(d,i) { return d.id; })
      .attr("title", function(d, i) { return d.properties.name; })
      // TO DO: fill color according to murderdata (chloropleth)
      .style("fill", function(d, i) { return d.properties.color; });

  // offsets for tooltips
  var offsetL = document.getElementById('container').offsetLeft + 20;
  var offsetT = document.getElementById('container').offsetTop + 10;

  // tooltips appear when mouse is over country - and follow mouse movements
  country
    .on("mousemove", function(d, i) {

      console.log(murderRate[d.properties.name]);

      // mouse place on the map
      var mouse = d3.mouse(svg.node()).map( function(d) { return parseInt(d); });

      // tooltip is visible when mouse moves on country
      tooltip.classed("hidden", false)
        // tooltip placement
        .attr("style", "left:" + (mouse[0] + offsetL) + "px;top:" + (mouse[1] + offsetT)+"px")
        // .html(d.properties.name + murderRate[d.properties.name]);
        .html("<strong>Country:</strong> <span style='color:midnightblue'>" + d.properties.name + "</span>" + "<br>" +
          "<strong>Murders:</strong> <span style='color:midnightblue'>" + murderRate[d.properties.name] + "</span>");
    })

    // when mouse moves away, tooltip disappears
    .on("mouseout",  function(d, i) {
      tooltip.classed("hidden", true);
    }); 
}

// 
function redrawMap() {

  console.log("redrawMap aangeroepen!");

  width = document.getElementById('container').offsetWidth;
  height = width / 2;
  d3.select('svg').remove();
  setupMap(width,height);
  drawTopo(countries);
}

// 
function move() {

  console.log("move functie aangeroepen!");

  var t = d3.event.translate;
  var s = d3.event.scale; 
  zscale = s;
  var h = height/4;

  // 
  t[0] = Math.min(
    (width/height)  * (s - 1), 
    Math.max( width * (1 - s), t[0] )
  );

  t[1] = Math.min(
    h * (s - 1) + h * s, 
    Math.max(height  * (1 - s) - h * s, t[1])
  );

  zoom.translate(t);
  g.attr("transform", "translate(" + t + ")scale(" + s + ")");
  d3.selectAll(".country").style("stroke-width", 1.5 / s);
}

 function throttle() {

console.log("throttle functie aangeroepen!");

  window.clearTimeout(throttleTimer);
    throttleTimer = window.setTimeout(function() {
      redrawMap();
    }, 200);
}

//geo translation on mouse click in map
function click() {
  var latlon = projection.invert(d3.mouse(this));
  console.log(latlon);
}

  // G map dimensions setup
function setupMap (width,height) {

  console.log("setupMap aangeroepen!");

  projection = d3.geo.mercator()
    .translate([(width/2), (height/2)])
    .scale( width / 2 / Math.PI);

  // to draw countries
  path = d3.geo.path().projection(projection);

  // map can be zoomed and clicked everywhere
  svg = d3.select("#container").append("svg")
      .attr("width", width)
      .attr("height", height)
      .call(zoom)
      .on("click", click)
      .append("g");
  g = svg.append("g");
}