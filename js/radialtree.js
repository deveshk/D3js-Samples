function init() {
    document.getElementById('rcChart').innerHTML = '';
    checkedValue = getRadio();
    if (checkedValue == "cluster") {
        var tree = d3.layout.cluster();
        gatChart(tree);
    } else {
        var tree = d3.layout.tree();
        gatChart(tree);
    }
}

function getRadio() {
    var radios = document.getElementsByName('Radial');
    var checkedValue;
    for (var i = 0, length = radios.length; i < length; i++) {
        if (radios[i].checked) {
            checkedValue = radios[i].value;
            break;
        }
    }
    return checkedValue;
}
function gatChart(tree) {
    var diameter = 960;
    //size  1st parameter is saying 360degree round
    tree.size([360, diameter / 2 - 120])
        .separation(function (a, b) {
            return (a.parent == b.parent ? 1 : 2) / a.depth;
        });
    var diagonal = d3.svg.diagonal.radial()
    // change x and y (for the left to right tree)
    .projection(function (d) {
        return [d.y, d.x / 180 * Math.PI];
    });

    var svg = d3.select("#rcChart").append("svg")
        .attr("width", diameter)
        .attr("height", diameter)
        .append("g")
        .attr("transform", "translate(" + diameter / 2 + "," + diameter / 2 + ")");

    d3.json("data/flare.json", function (error, treeData) {
        // Preparing the data for the tree layout, convert data into an array of nodes
        var nodes = tree.nodes(treeData);
        // Create an array with all the links
        var links = tree.links(nodes);


        svg.selectAll(".link")
            .data(links)
            .enter().append("path")
            .attr("class", "link")
            .attr("d", diagonal)

        var node = svg.selectAll("g.node")
            .data(nodes)
            .enter().append("g")
            .attr("class", "node")
            .attr("transform", function (d) {
                return "rotate(" + (d.x - 90) + ")translate(" + d.y + ")";
            })

        // Add the dot at every node
        node.append("circle")
            .attr("r", 4);

        // place the name atribute left or right depending if children
        node.append("text")
        //.attr("dx", function(d) { return d.children ? -8 : 8; })
            .attr("dy", ".31em")
            .attr("text-anchor", function (d) {
                return d.x < 180 ? "start" : "end";
            })
            .attr("transform", function (d) {
                return d.x < 180 ? "translate(8)" : "rotate(180)translate(-8)";
            })
            .text(function (d) {
                return d.name;
            });
    });
    
}
init();