

// set svg dims
function createMap(width, height) {
  d3.select("#map")                     
      .attr("width", width)
      .attr("height", height/1.5)
    .append("text")
      .attr("x", width / 2)
      .attr("y", "1em")
      .attr("font-size", "1.5em")
      .style("text-anchor", "middle")
      .classed("map-title", true);
}

function drawMap(geoData, climateData, year, dataType) {
  var map = d3.select("#map");

  var projection = d3.geoMercator() 
                     .scale(130)
                     .translate([
                       +map.attr("width") / 2,
                       +map.attr("height") / 1.5
                     ]);

  var path = d3.geoPath()
               .projection(projection);

  d3.select("#year-val").text(year);     


  // join geoData and csv data using id / countrycode, ie, attaching emissions data for each country in geoData
  geoData.forEach(d => {
    var countries = climateData.filter(row => row.countryCode === d.id);  
    var name = '';
    if (countries.length > 0) name = countries[0].country;    
    d.properties = countries.find(c => c.year === year) || { country: name };  
  });

  var colors = ["#737912", "#959D19", "#BCC621", "#E8F42A"];

  var domains = {
    emissions: [0, 3e5, 1e6, 5.5e6],
    emissionsPerCapita: [0, 0.5, 3, 10]
  };

  var mapColorScale = d3.scaleLinear()
                        .domain(domains[dataType])
                        .range(colors);


  //update pattern
  var update = map.selectAll(".country")
                  .data(geoData);

  update
    .enter()
    .append("path")
      .classed("country", true)         
      .attr("d", path)
      .on("click", function() {          
        var currentDataType = d3.select("input:checked")
                                .property("value");
        var country = d3.select(this);
        var isActive = country.classed("active");           
        var countryName = isActive ? "" : country.data()[0].properties.country;  
        drawBar(climateData, currentDataType, countryName);
        highlightBars(+d3.select("#year").property("value"));
        d3.selectAll(".country").classed("active", false);  
        country.classed("active", !isActive);               
      })
    .merge(update)
      .transition()
      .duration(750)
      .attr("fill", d => {
        var val = d.properties[dataType];
        return val ? mapColorScale(val) : "#ddd";        
      });

  d3.select(".map-title")
      .text("World - Heat map of "+graphTitle(dataType) + " in " + year+".");
}

function graphTitle(str) {
  return str.replace(/[A-Z]/g, c => " " + c.toLowerCase());   
}























