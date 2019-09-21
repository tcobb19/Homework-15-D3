// set the dimensions and margins of the graph
var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#scatter")
.append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

//Read the data
d3.csv("data.csv")
  .then(function(healthData) {
// parse data to numbers
  healthData.forEach(function(data) {
    data.obesity = +data.obesity;
    data.age = +data.age;
  });
// Add axes

var xLinearScale = d3.scaleLinear()
.domain([0, d3.max(healthData, d => d.obesity) + 5])
.range([0, width]);

var yLinearScale = d3.scaleLinear()
.domain([0, d3.max(healthData, d => d.age) + 5])
.range([height, 0]);

var bottomAxis = d3.axisBottom(xLinearScale);
var leftAxis = d3.axisLeft(yLinearScale);

chartGroup.append("g")
.attr("transform", `translate(0, ${height})`)
.call(bottomAxis);

chartGroup.append("g")
.call(leftAxis);

// Add dots
var circlesGroup = chartGroup.selectAll("circle")
.data(healthData)
.enter()
.append("circle")
.attr("cx", d => xLinearScale(d.obesity))
.attr("cy", d => yLinearScale(d.age))
.attr("r", "8")
.attr("fill", "blue")
.attr("opacity", ".65");
// Add tooltips
var toolTip = d3.tip()
.attr("class", "tooltip")
.offset([80, -60])
.html(function(d) {
  return (`${d.state}`);
});

chartGroup.call(toolTip);
// display tip on click
circlesGroup.on("click", function(data) {
  toolTip.show(data, this);
})
// onmouseout event
  .on("mouseout", function(data, index) {
    toolTip.hide(data);
  });
  chartGroup.append("text")
  .attr("transform", "rotate(-90)")
  .attr("y", 0 - margin.left + 40)
  .attr("x", 0 - (height / 2))
  .attr("dy", "1em")
  .attr("class", "axisText")
  .text("Average age (years)");

chartGroup.append("text")
  .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
  .attr("class", "axisText")
  .text("Obesity rate (%)");
})
