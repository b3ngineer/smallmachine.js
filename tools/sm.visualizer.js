;(function(sm, $) {

	var Element = function(obj) {
		if (!obj._value) return null;
		this.name = obj._value;
		this.children = [];
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


	var cluster = d3.layout.cluster()
		.size([height, width - 160]);

	var diagonal = d3.svg.diagonal()
		.projection(function(d) { return [d.y, d.x]; });

	var svg = d3.select("body").append("svg")
		.attr("width", width)
		.attr("height", height)
	  .append("g")
		.attr("transform", "translate(40,0)");

	var nodes = cluster.nodes(denormalizedOntology),
		  links = cluster.links(nodes);

	var link = svg.selectAll(".link")
		  .data(links)
		.enter().append("path")
		  .attr("class", "link")
		  .attr("d", diagonal);

	var node = svg.selectAll(".node")
		  .data(nodes)
		.enter().append("g")
		  .attr("class", "node")
		  .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; })

	node.append("circle")
		  .attr("r", 4.5);

	node.append("text")
		  .attr("dx", function(d) { return d.children ? -8 : 8; })
		  .attr("dy", 3)
		  .attr("class", "text")
		  .style("text-anchor", function(d) { return d.children ? "end" : "start"; })
		  .text(function(d) { return d.name; });

	d3.select(self.frameElement).style("height", height + "px");
	

}(sm, jQuery));
