;(function(sm, $, raphael) {
	var ontology = new sm.Ontology('sm.flowchart');

	ontology.addTerm('initialize');
	ontology.addTerm('get');

	var TOP_MARGIN = 50;
	var SIBLING_MARGIN = 20;
	var SECTOR_MARGIN = 80;
	var GROUP_MARGIN = 40;

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
		this.lastNodeGroup = parentId;
		this.layoutWidth = layoutWidth;
		this.nodes = [];
		return this;
	};

	Sector.prototype.add = function(node, nodeGroup) {
		var nodeWidth = parseFloat(node.width);
		this.width = this.width + SIBLING_MARGIN + nodeWidth;
		var nodeHeight = parseFloat(node.height);
		this.height = this.height < nodeHeight ? nodeHeight : this.height;
		this.x = this.x - (SIBLING_MARGIN * 0.5) - (nodeWidth * 0.5);
		this.nodes.push({node: node, nodeGroup: nodeGroup});
	};

	Sector.prototype.finalize = function() {
		var lastNodeGroup = null;
		for (var i = 0; i < this.nodes.length; i++) {
			var margin = SIBLING_MARGIN * i;
			if (lastNodeGroup === null) {
				lastNodeGroup = this.nodes[i].nodeGroup;
			}
			else if (this.nodes[i].nodeGroup != lastNodeGroup) {
				margin = margin + GROUP_MARGIN;
				lastNodeGroup = this.nodes[i].nodeGroup;
			}
			this.nodes[i].node.x = this.x + margin + (this.nodes[i].node.width * i); 
			this.nodes[i].node.y = this.y;
		}
	};

	var Layout = function(paper) {
		this.paper = paper;
		this.width = parseFloat(paper.value.width);
		this.height = parseFloat(paper.value.height);
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
			this.sectors[i].finalize();
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
		setNodeCoords(rootNode, nodes, nodeIndex, layout, sectorId, rootNode.id);
		layout.finalize();
	};

	var setNodeCoords = function(current, nodes, index, layout, sectorId, parentId) {
		layout.addToSector(current, sectorId++, parentId);
		for (var i = 0; i < current.edges.length; i++) {
			var id = current.edges[i].id;
			var nodeIndex = index[id];
			var next = nodes[nodeIndex];
			setNodeCoords(next, nodes, index, layout, sectorId, current.id);
		}
	};

	var activator = function(model) {
		model.initialize.subscribe(function(message) {
			if (sm.typeMask(message, { length : true, sort : 'function' } ) === null) {
				return function(message) {
					var root = new sm.type.NamedValue('sm.flowchart', 'root', null);
					model.get.publish(root);
					var paper = new sm.type.NamedValue('sm.raphaeljs', 'paper', null);
					model.get.publish(paper);
					format(message, root.value, new Layout(paper));
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
