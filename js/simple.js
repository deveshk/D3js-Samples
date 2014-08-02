var simple = {
    getChart: function(id, margin, width, height) {
        var w = width - margin.l - margin.r;
        var h = height - margin.t - margin.b;
        var x = d3.time.scale().range([0, w - margin.l - margin.r]),
                y = d3.scale.linear().range([h - margin.t - margin.b, 0]);
        var parseDate = d3.time.format("%b-%Y").parse;
        var xAxis = d3.svg.axis()
                .scale(x)
                .tickSubdivide(true)
                .orient("bottom");

        var yAxis = d3.svg.axis()
                .scale(y)
                .ticks(5)
                .tickSubdivide(true)
                .orient("left");

        d3.json("data/simple.json", function(data) {
            var line = d3.svg.line()
                    .x(function(d) {
                        return x(d.date);
                    })
                    .y(function(d) {
                        return y(d.value);
                    });
            var line0 = d3.svg.line()
                    .x(function(d) {
                        return x(d.date);
                    })
                    .y(function(d) {
                        return y(0);
                    });
            data.datapoints.forEach(function(d) {
                d.date = parseDate(d.date);
            });
            //removing Older SVG on if exist
            var oldSvg = d3.select("#" + id).select("svg");
            if (oldSvg) {
                oldSvg[0].forEach(function(s) {
                    if (s)
                        s.remove();
                });
            }
            //Appending SVG
            var svg = d3.select("#" + id).append("svg")
                    .attr("width", w)
                    .attr("height", h)
                    .attr("transform", "translate(0," + (-margin.b) + ")");

            x.domain(d3.extent(data.datapoints, function(d) {
                return d.date;
            }));
            y.domain([0, 15]);
            svg.append("g")
                    .attr("class", "x axis")
                    .attr("transform", "translate(" + margin.l + "," + (h - margin.b) + ")")
                    .call(xAxis);

            svg.append("g")
                    .attr("class", "y axis")
                    .attr("transform", "translate(" + margin.l + "," + (margin.t) + ")")
                    .call(yAxis);
            svg.append("text")
                    .attr("class", "axisTitle")
                    .attr("text-anchor", "end")
                    .attr("x", (margin.t + margin.b - h) / 2)
                    .attr("y", (margin.r))
                    .text("value")
                    .attr("transform", function(d) {
                        return "rotate(-90)";
                    });
            svg.append("text")
                    .attr("class", "axisTitle")
                    .attr("text-anchor", "end")
                    .attr("x", (w + margin.r) / 2)
                    .attr("y", ((h + margin.b)))
                    .text("month");
            svg.append("g")
                    .attr("transform", "translate(" + margin.l + ",0)")
                    .append("path")
                    .attr("class", "hbg")
                    .attr("d", line0(data.datapoints))
                    .attr("transform", "translate(0," + margin.t + ")")
                    .transition()
                    .duration(2000)
                    .attr("d", line(data.datapoints));
            svg.append("g")
                    .attr("transform", "translate(" + margin.l + "," + (margin.t) + ")")
                    .selectAll("circle")
                    .data(data.datapoints)
                    .enter()
                    .append("circle")
                    .attr({class: function(d, i) {
                            return ("HBG-Nodes");
                        }})
                    .attr({
                        cx: function(d, i) {
                            return x(d.date);
                        },
                        cy: function(d, i) {
                            return y(0);
                        },
                        r: 2
                    })
                    .transition()
                    .duration(2000)
                    .attr({
                        cx: function(d, i) {
                            return x(d.date);
                        },
                        cy: function(d, i) {
                            return y(d.value);
                        },
                        r: 8
                    });
            d3.selectAll("circle")
                    .on("mouseover", simple.onZoom)
                    .on("mouseout", simple.offZoom);
        });
    },
    onZoom: function(d) {
        var tooltip = d3.select("body").append("div").attr("class", "tooltip").style("opacity", 0);
        tooltip.transition()
                .duration(200)
                .style("opacity", .9);
        tooltip.html("Datapoints : " + d.value)
                .style("left", (d3.event.pageX + 5) + "px")
                .style("top", (d3.event.pageY - 28) + "px");
        d3.select(this)
                .transition()
                .duration(800).style("opacity", 1)
                .attr("r", 12).ease("elastic");
    },
    offZoom: function(d) {
        var tooltip = d3.select("body").append("div").attr("class", "tooltip").style("opacity", 0);
        tooltip.transition()
                .duration(200)
                .style("opacity", 0).each("end", function() {
            d3.selectAll(".tooltip").remove();
        });
        d3.select(this)
                .transition()
                .duration(100).style("opacity", 1)
                .attr("r", 8).ease("elastic");
    }
};
