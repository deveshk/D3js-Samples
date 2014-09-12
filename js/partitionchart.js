var width = 750;
var height = 600;
var radius = Math.min(width, height) / 2;
var svg = d3.select("#partitionchart").append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("id", "container")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
var hue = d3.scale.category10();
var luminance = d3.scale.sqrt()
    .domain([0, 1e6])
    .clamp(true)
    .range([90, 30]);

var partition = d3.layout.partition()
    .size([2 * Math.PI, radius * radius])
    .value(function (d) {
        return d.size;
    });
var arc = d3.svg.arc()

	.startAngle(function (d) {
	    return d.x;
	})
    .endAngle(function (d) {
        return d.x + d.dx - .01 / (d.depth + .5);
        //return d.x + d.dx;
    })
    .innerRadius(function (d) {
        return radius / 5 * d.depth;
        //return Math.sqrt(d.y);
    })
    .outerRadius(function (d) {
        return radius / 5 * (d.depth + 1) - 1;
        //return Math.sqrt(d.y + d.dy);
    });


    // Bounding circle underneath the sunburst, to make it easier to detect
    // when the mouse leaves the parent g.
    svg.append("circle")
        .attr("r", radius)
        .style("opacity", 0);

d3.json("data/flare.json", function (error, json) {
    // For efficiency, filter nodes to keep only those large enough to see.
    var node = partition.nodes(json)
        .filter(function (d) {
            return (d.dx > 0.005); // 0.005 radians = 0.29 degrees
        });

    path = svg.data([json]).selectAll("path")
        .data(node)
        .enter().append("path")
        .attr("display", function (d) {
            return d.depth ? null : "none";
        })
        .attr("d", arc)
        .attr("fill-rule", "evenodd")
        .style("fill", function (d) {
            return fill(d);
        })
        .style("opacity", 1)
        .on("mousemove", magnify)
        .each(stash);
});

function fill(d) {
    var p = d;
    while (p.depth > 1) p = p.parent;
    var c = d3.lab(hue(p.name));
    c.l = luminance(d.value);
    return c;
}
// Distort the specified node to 80% of its parent.
function magnify(node) {
  if (parent = node.parent) {
    var parent,
        x = parent.x,
        k = .8;
    parent.children.forEach(function(sibling) {
      x += reposition(sibling, x, sibling === node
          ? parent.dx * k / node.value
          : parent.dx * (1 - k) / (parent.value - node.value));
    });
  } else {
    reposition(node, 0, node.dx / node.value);
  }

  path.transition()
      .duration(750)
      .attrTween("d", arcTween);
}

// Recursively reposition the node at position x with scale k.
function reposition(node, x, k) {
  node.x = x;
  if (node.children && (n = node.children.length)) {
    var i = -1, n;
    while (++i < n) x += reposition(node.children[i], x, k);
  }
  return node.dx = node.value * k;
}

// Stash the old values for transition.
function stash(d) {
  d.x0 = d.x;
  d.dx0 = d.dx;
}
// Interpolate the arcs in data space.
function arcTween(a) {
  var i = d3.interpolate({x: a.x0, dx: a.dx0}, a);
  return function(t) {
    var b = i(t);
    a.x0 = b.x;
    a.dx0 = b.dx;
    return arc(b);
  };
}