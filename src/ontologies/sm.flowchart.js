;(function(sm, $, raphael) {
	var ontology = new sm.Ontology('sm.flowchart');

	ontology.addTerm('paint');
	ontology.addTerm('get');

	var TOP_MARGIN = 50;
	var SIBLING_MARGIN = 40;
	var SECTOR_MARGIN = 80;
	var GROUP_MARGIN = 40;
	var FIXED_EDGE_LENGTH = false;

	var Sector = function(previousSector, layoutWidth, layoutHeight, parentId) {
		if (typeof previousSector === 'undefined') {
			this.y = TOP_MARGIN;
			this.previousSector = { y:0, height:0 };
		}
		else {
			this.previousSector = previousSector;
			this.y = this.previousSector.y + this.previousSector.height + SECTOR_MARGIN;
		}
		this.height = 0;
		this.x = layoutWidth * 0.5;
		this.width = 0;
		this.layoutWidth = layoutWidth;
		this.lastNodeGroup = null;
		this.nodeGroups = 0;
		this.nodes = [];
		return this;
	};

	Sector.prototype.add = function(node, nodeGroup) {
		var nodeWidth = parseFloat(node.width);
		if (this.lastNodeGroup === null) {
			this.lastNodeGroup = nodeGroup;
		}
		else if (this.lastNodeGroup != nodeGroup) {
			this.nodeGroups++;
			this.lastNodeGroup = nodeGroup;
		}
		this.width = this.width + SIBLING_MARGIN + nodeWidth;
		var nodeHeight = parseFloat(node.height);
		this.height = this.height < nodeHeight ? nodeHeight : this.height;
		this.x = this.x - (SIBLING_MARGIN * 0.5) - (nodeWidth * 0.5);
		if (!FIXED_EDGE_LENGTH) {
			var maxEdgeLabelLength = 0;
			for (var i = 0; i < node.edges.length; i++) {
				if (node.edges[i].label.length > maxEdgeLabelLength) {
					maxEdgeLabelLength = node.edges[i].label.length;
				}
			}
			if (maxEdgeLabelLength > 6) {
				var newHeight = this.height + ((maxEdgeLabelLength - 6) * 10);
				if (newHeight > this.height) {
					this.height = newHeight;
				}
			}
		}
		this.nodes.push({node: node, nodeGroup: nodeGroup});
	};

	Sector.prototype.finalize = function(newWidth) {
		if (typeof newWidth === 'undefined' || newWidth < 0) newWidth = 0;
		var widthAdjustment = newWidth * 0.5,
		 	lastNodeGroup = null,
			groupLevel = 0;

		for (var i = 0; i < this.nodes.length; i++) {
			if (lastNodeGroup === null) {
				lastNodeGroup = this.nodes[i].nodeGroup;
			}
			else if (this.nodes[i].nodeGroup != lastNodeGroup) {
				groupLevel++;
				lastNodeGroup = this.nodes[i].nodeGroup;
			}
			var adjustLeft = (SIBLING_MARGIN * i) + (GROUP_MARGIN * groupLevel);
			this.nodes[i].node.x = this.x + adjustLeft + (this.nodes[i].node.width * i) + widthAdjustment; 
			this.nodes[i].node.y = this.y;
		}
	};

	var Layout = function(paper) {
		this.paper = paper;
		this.width = parseFloat(paper.width);
		this.height = parseFloat(paper.height);
		this.finalWidth = this.width;
		this.finalHeight = this.height;
		this.sectors = [];
		return this;
	};

	Layout.prototype.addToSector = function(node, sectorId, parentId) {
		var sector = this.sectors[sectorId];
		if (typeof sector === 'undefined') {
			sector = new Sector(this.sectors[sectorId - 1], this.width, this.height, parentId);
			this.sectors[sectorId] = sector;
		}
		sector.add(node, parentId);
	};

	Layout.prototype.finalize = function() {
		for (var i = 0; i < this.sectors.length; i++) {
			this.sectors[i].width = this.sectors[i].width + (this.sectors[i].nodeGroups * GROUP_MARGIN);
			if (this.sectors[i].width > this.finalWidth) {
				this.finalWidth = this.sectors[i].width;
			}
		}
		for (var i = 0; i < this.sectors.length; i++) {
			this.sectors[i].finalize(this.finalWidth - this.width);
		};
	};

	var format = function(nodes, root, layout) {
		var nodeIndex = {};
		var sectorId = 0;
		var rootNode = nodes[0];
		for (var i = 0; i < nodes.length; i++) {
			nodeIndex[nodes[i].id] = i;
			if (nodes[i].id === root) {
				rootNode = nodes[i];
			}
		}
		if (typeof rootNode === 'undefined') {
			sm.error(new Error('Could not determine the root node for the given node list (as specified): ' + root));
		}
		setNodeCoords(rootNode, nodes, nodeIndex, layout, sectorId, rootNode.id);
		layout.finalize();
	};

	var setNodeCoords = function(current, nodes, index, layout, sectorId, parentId) {
		layout.addToSector(current, sectorId++, parentId);
		for (var i = 0; i < current.edges.length; i++) {
			var id = current.edges[i].id;
			var nodeIndex = index[id];
			if (typeof nodeIndex === 'undefined') {
				continue;
			}
			var next = nodes[nodeIndex];
			setNodeCoords(next, nodes, index, layout, sectorId, current.id);
		}
	};

	var activator = function(model) {
		model.paint.subscribe(function(message) {
			if (sm.typeMask(message.value, { length : true, sort : 'function' } ) === null) {
				return function(mesage) {
					var json = message.value;
					var root = new sm.type.NamedValue('sm.flowchart', 'root', null);
					model.get.publish(root);
					var paper = new sm.type.NamedValue('sm.raphaeljs', 'paper', null);
					model.get.publish(paper);
					var layout = new Layout(paper.value);
					format(json, root.value, layout);
					paper.value.setSize(layout.finalWidth * 1.05, layout.finalHeight * 1.05);
					return false; // proceed to delegated subscribers
				};
			}
		});
	};

	ontology.registerActivator(activator, ['sm.channels', 'sm.nodes', 'sm.raphaeljs']);

	try {
		sm.ontology.extendedBy(ontology);
	}
	catch (error) {
		sm.error(new Error('Could not extend the smallmachine.ontology property with the \'sm.nodes\' ontology: ' + error.message + '\n' + error.stack));
	}
}(smallmachine, jQuery, Raphael));
