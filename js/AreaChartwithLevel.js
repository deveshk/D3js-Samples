var chart = {
    init: function (h, w) {
        var margin = {t: 30, r: 20, b: 20, l: 70};
        d3.json("data/areaData.json", function (data) {
            chart.getChart("chart1", margin, w ? w : window.innerWidth, h ? h : window.innerHeight, data);
            d3.select("#levelSelector").on("change", function () {
                chart.levelChange(margin, w ? w : window.innerWidth, h ? h : window.innerHeight, data);
            });
        });
    },
    getChart: function (id, margin, width, height, data) {
        var w = width - margin.l - margin.r;
        var h = height - margin.t - margin.b;
        var x = d3.scale.linear().range([0, w - margin.l - margin.r]),
                y = d3.scale.linear().range([h - margin.t - margin.b, 0]);
        var xAxis = d3.svg.axis()
                .scale(x)
                .tickSubdivide(true)
                .orient("bottom");

        var yAxis = d3.svg.axis()
                .scale(y)
                .ticks(5)
                .tickSubdivide(true)
                .orient("left");
        var line = d3.svg.line()
                .x(function (d) {
                    return x(d.x);
                })
                .y(function (d) {
                    return y(d.y - 1);
                });
        var lineArea = d3.svg.line()
                .x(function (d, i) {
                    return x(i);
                })
                .y(function (d) {
                    return y(d - 1);
                });
        var area = d3.svg.area()
                .x(function (d, i) {
                    return x(i);
                })
                .y0(h - margin.b)
                .y1(function (d) {
                    return y(d - 1);
                });
        //Appending SVG
        var svg = d3.select("#" + id).append("svg")
                .attr("width", w)
                .attr("height", h)
                .attr("transform", "translate(0," + (-margin.b) + ")");

        x.domain([0, data.datapoints.length - 1]);
        y.domain([0, d3.max(data.datapoints) + 5]);
        svg.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(" + margin.l + "," + (h - margin.b) + ")")
                .call(xAxis);

        svg.append("g")
                .attr("class", "y axis")
                .attr("transform", "translate(" + margin.l + "," + (margin.t) + ")")
                .call(yAxis);
        svg.append("text")
                .attr("class", "yaxisTitle")
                .attr("text-anchor", "end")
                .attr("x", (margin.t + margin.b - h) / 2)
                .attr("y", (margin.r))
                .text("Y Axis")
                .attr("transform", function (d) {
                    return "rotate(-90)";
                });
        svg.append("text")
                .attr("class", "xaxisTitle")
                .attr("text-anchor", "end")
                .attr("x", (w + margin.r) / 2)
                .attr("y", ((h + margin.b)))
                .text("X Axis");
        svg.append("g")
                .attr("transform", "translate(" + margin.l + ",0)")
                .append("path")
                .attr("class", "area")
                .attr("d", area(data.datapoints));
        svg.append("g")
                .attr("transform", "translate(" + margin.l + ",0)")
                .append("path")
                .attr("class", "lineArea")
                .attr("d", lineArea(data.datapoints));
        var lineAtY = [{x: 0, y: 10}, {x: (data.datapoints.length - 1), y: 10}];
        svg.append("g")
                .attr("transform", "translate(" + margin.l + ",0)")
                .append("path")
                .attr("class", "level")
                .attr("d", line(lineAtY));
    },
    levelChange: function (margin, width, height, data) {
        var w = width - margin.l - margin.r;
        var h = height - margin.t - margin.b;
        var x = d3.scale.linear().range([0, w - margin.l - margin.r]),
                y = d3.scale.linear().range([h - margin.t - margin.b, 0]);
        x.domain([0, data.datapoints.length - 1]);
        y.domain([0, d3.max(data.datapoints) + 5]);
        var line = d3.svg.line()
                .x(function (d) {
                    return x(d.x);
                })
                .y(function (d) {
                    return y(d.y - 1);
                });
        var current = d3.select("#levelSelector").property("value");
        var lineAtY = [{x: 0, y: current}, {x: (data.datapoints.length - 1), y: current}];
        d3.selectAll("svg g path.level")
                .data(lineAtY)
                .transition()
                .duration(3000)
                .attr("d", line(lineAtY));
    }
};
