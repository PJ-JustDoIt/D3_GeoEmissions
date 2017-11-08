function createPie(width, height) {
  var pie = d3.select("#pie")                 
                  .attr("width", width)
                  .attr("height", height);


  pie.append("g")                           
      .attr("transform", "translate(" + width / 2 + ", " + (height / 2 + 10) + ")")
      .classed("chart", true);              

  pie.append("text")
      .attr("x", width / 2)
      .attr("y", "1em")
      .attr("font-size", "1.5em")
      .style("text-anchor", "middle")
      .classed("pie-title", true);          
}

function drawPie(data, currentYear) {
  var pie = d3.select("#pie");

  //sorting by continents first
  var arcs = d3.pie()
               .sort((a,b) => {
                 if (a.continent < b.continent) return -1;
                 if (a.continent > b.continent) return 1;
                 return a.emissions - b.emissions;
               })
               .value(d => d.emissions);

  var path = d3.arc()
               .outerRadius(+pie.attr("height") / 2 - 50)
               .innerRadius(50);


  var yearData = data.filter(d => d.year === currentYear);
  // create array of continents
  var continents = [];
  for (var i = 0; i < yearData.length; i++) {
    var continent = yearData[i].continent;
    if (!continents.includes(continent)) {
      continents.push(continent);
    }
  }

  var colorScale = d3.scaleOrdinal()
                     .domain(continents)
                     .range(["#F1A409", "#F16409", "#F1ED09", "#D1F109", "#09F199"]);

  //  update pattern
  var update = pie
                 .select(".chart")
                 .selectAll(".arc")
                 .data(arcs(yearData));

  // remove old arcs
  update
    .exit()
    .remove();


  update
    .enter()
      .append("path")
      .classed("arc", true)
      .attr("stroke", "#dee1ee")
      .attr("stroke-width", "0.30px")
    .merge(update)
      .attr("fill", d => colorScale(d.data.continent))  
      .attr("d", path);

  pie.select(".pie-title")
      .text("Total emissions by continent and country, " + currentYear);
}











