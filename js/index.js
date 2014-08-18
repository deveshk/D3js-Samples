var dataset = [25, 7, 5, 26, 11, 8, 25, 14, 23, 19,
    14, 11, 22, 29, 11, 13, 12, 17, 18, 10,
    24, 18, 25, 9, 3
];

d3.select("#bar1")
    .selectAll("div")
    .data(dataset)
    .enter()
    .append("div")
    .attr("class", "bar")
    .style("height", function (d) {
        return (d * 5) + "px";
    })
    
    
var h = 100;
var w = 1300;
var svg = d3.select("#rcChart").append("svg")
    .attr("height", h)
    .attr("width", w);
    
var circles = svg.selectAll("circle")
    .data(dataset)
    .enter()
    .append("circle");

circles.attr("cx", function (d, i) {
    return (i * 50) + 25;
})
    .attr("cy", h / 2)
    .attr("r", function (d) {
        return d;
    })
    .attr("fill", "yellow")
    .attr("stroke", "orange");
    
    
    
var h1 = 200;
var w1 = 1000;
var svg1 = d3.select("#bar2").append("svg")
    .attr("height", h1)
    .attr("width", w1)
.append("g");
var bar = svg1.selectAll("rect")
    .data(dataset)
    .enter()
    .append("rect")
    .attr("class","bar")
    .style("fill", "steelblue")
    .attr("height", function (d) {
        return (d * 5) + "px";
    })
    .attr("y",function(d){
        return (200-(d * 5));
    })
    .attr("width",15)
    .attr("transform",function(d, i) { return "translate("+ i * 20 +",0)"; });