;(function(sm, $) {

	var Element = function(obj) {
		if (!obj._value) return null;
		this.name = obj._value;
		this.children = [];
        this.type = obj._type;
		return this;
	};

	function denormalize(obj, currentElement) {
		for (var p in obj) {
			if (!obj.hasOwnProperty(p))	{
				continue;
			}
			if (typeof obj[p] === 'function' || p.indexOf("_") === 0) {
				continue;
			}

			var child = new Element(obj[p]);
			if (child) {
				currentElement.children.push(child);
				denormalize(obj[p], child);
			}
		};

		return currentElement;
	};


	var denormalizedOntology = denormalize(sm.thing, new Element(sm.thing));

	var width = window.innerWidth || document.documentElement.clientWidth || document.documentElement.getElementsByTagName('body')[0].clientWidth,
		height = window.innerHeight || document.documentElement.clientHeight || document.documentElement.getElementsByTagName('body')[0].clientHeight;
 
    width = width * 0.90;
    height = height * 0.80;

    var tree = d3.layout.tree()
        .sort(null)
        .size([height, width - 150])
        .children(function(d) {
            return (!d.children || d.children.length === 0) ? null : d.children;
        });

    var nodes = tree.nodes(denormalizedOntology);
    var links = tree.links(nodes);

    var layoutRoot = d3.select("body")
     .append("svg:svg")
     .attr("width", width)
     .attr("height", height)
     .append("svg:g")
     .attr("class", "container");

     var link = d3.svg.diagonal()
         .projection(function(d) {
             return [d.y, d.x];
         });

     layoutRoot.selectAll("path.link")
         .data(links)
         .enter()
         .append("svg:path")
         .attr("class", "link")
         .attr("d", link)
         .attr("transform", "translate(100,0)");

     var nodeGroup = layoutRoot.selectAll("g.node")
         .data(nodes)
         .enter()
         .append("svg:g")
         .attr("class", function(d) { return "node " + d.type; })
         .attr("transform", function(d) { return "translate(" + (d.y + 100) + "," + d.x + ")"; });

     nodeGroup.append("svg:circle")
         .attr("r", function(d){ return d.type == 'concept' ? 8 : 0; });

     nodeGroup.append("svg:text")
         .attr("text-anchor", function(d) { return d.children ? "end" : "start"; })
         .attr("dx", function(d) {
             var gap = 12;
             return d.children ? -gap : gap;
         })
         .attr("dy", 3)
         .text(function(d) { return d.name; });

}(sm, jQuery));
