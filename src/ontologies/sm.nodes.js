;(function(sm) {
	var ontology = new sm.Ontology('sm.nodes');

	ontology.addTerm('task');
	ontology.addTerm('insert');
	ontology.addTerm('connect');
	ontology.addTerm('set');
	ontology.addTerm('get');
	ontology.addTerm('paint');
	ontology.addTerm('paintNodes');
	ontology.paint.isA(ontology.task);
	ontology.insert.isA(ontology.task);
	ontology.connect.isA(ontology.task);
	ontology.set.isA(ontology.task);
	ontology.get.isA(ontology.task);
	ontology.paintNodes.isA(ontology.paint);

	function shape(item, s) {
		s.y = parseFloat(item.y);
		s.x = parseFloat(item.x);
		s.width = parseFloat(item.width);
		s.height = parseFloat(item.height);
		return this;
	};

	function ellipse(item) {
		new shape(item, this);
		return this;
	}

	ellipse.prototype.draw = function(paper) {
		return paper.ellipse(this.x, this.y, this.width / 2, this.height / 2);
	};

	function rectangle(item) {
		new shape(item, this);
		return this;
	};

	rectangle.prototype.draw = function(paper) {
		return paper.rect(this.x - (this.width / 2), this.y - (this.height / 2), this.width, this.height);
	};

	function diamond(item) {
		new shape(item, this);
		return this;
	};

	diamond.prototype.draw = function(paper) {
		var x1 = this.x - (this.width / 2);
		var y1 = this.y;
		var y2 = this.y - (this.height / 2);
		var x3 = this.x + (this.width / 2);
		var y4 = this.y + (this.height / 2);
		return paper.path(['M', x1, y1, 'L', this.x, y2, 'L', x3, this.y, 'L', this.x, y4, 'L', x1, y1]);
	};

	function triangle(item) {
		new shape(item, this);
		return this;
	};

	triangle.prototype.draw = function(paper) {
		var x1 = this.x - (this.width / 2);
		var y1 = this.y + (this.height / 2);;
		var y2 = this.y - (this.height / 2);
		var x3 = this.x + (this.width / 2);
		var y3 = this.y + (this.height / 2);
		return paper.path(['M', x1, y1, 'L', this.x, y2, 'L', x3, y3, 'L', x1, y1]);
	};

	var shapes = {
		ellipse : ellipse,
		rectangle : rectangle,
		diamond : diamond,
		triangle : triangle
	}

	function Node(item, paper, shapeAttr, shapeLabelAttr) {
		var shape = item.shape || 'ellipse';
		this.shape = new shapes[shape](item);
		this.id = item.id || sm.getGuid();
		this.edges = item.edges || [];
		this.label = item.label || this.id;
		this.paper = paper;
		this.shapeAttr = shapeAttr;
		this.shapeLabelAttr = shapeLabelAttr;
		this.data = item.data || {};
		this.title = item.title || item.label;
		return this;
	};

	Node.prototype.update = function(message) {
		var element = this.shape.draw(this.paper);
		element.id = this.id;
		if (typeof this.shapeAttr === 'function') {
			this.shapeAttr(element, this);
		}
		else {
			element.attr(this.shapeAttr);
		}
		var shapeText = this.paper.text(this.shape.x, this.shape.y, this.label);
		if (this.title != "") {
			element.attr('title',this.title);
			shapeText.attr('title',this.title);
		}
		if (typeof this.shapeLabelAttr === 'function') {
			this.shapeLabelAttr(shapeText, this);
		}
		else {
			shapeText.attr(this.shapeLabelAttr);
		}
		return true;
	};

	function Edge(a, b, index, paper, lineAttr, edgeLabelAttr) {
		this.id1 = a.id;
		this.id2 = b.id;
		this.r1 =  a.shape.width / 2;
		this.r2 =  b.shape.width / 2;
		this.x1 = a.shape.x;
		this.y1 = a.shape.y;
		this.x2 = b.shape.x;
		this.y2 = b.shape.y;
		this.label = a.edges[index].label || '';
		this.paper = paper;
		this.lineAttr = lineAttr;
		this.edgeLabelAttr = edgeLabelAttr;
		this.data = {};
		return this;
	};

	Edge.prototype.update = function(message) {
		/*
		var d = Math.sqrt(Math.pow((this.x2 - this.x1), 2) + Math.pow((this.y2 - this.y1), 2));
		var r1 = this.r1 / d;
		var r2 = (d - this.r2) / d;
		var x3 = r1 * this.x2 + (1 - r1) * this.x1;
		var y3 = r1 * this.y2 + (1 - r1) * this.y1;
		var x4 = r2 * this.x2 + (1 - r2) * this.x1;
		var y4 = r2 * this.y2 + (1 - r2) * this.y1;
		var line = this.paper.path( ['M', x3, y3, 'L', x4, y4] );
		*/

		var line = this.paper.path( ['M', this.x1, this.y1, 'L', this.x2, this.y2] );
		if (typeof this.lineAttr === 'function') {
			this.lineAttr(line, this);
		}
		else {
			line.attr(this.lineAttr);
		}
		var a = this.x1 - this.x2;
		var b = this.y1 - this.y2;
		var cX = (this.x1 + this.x2) / 2; 
		var cY = (this.y1 + this.y2) / 2;
		var textLabel = this.paper.text(cX, cY, this.label);
		if (typeof this.edgeLabelAttr === 'function') {
			this.edgeLabelAttr(textLabel, this);
		}
		else {
			textLabel.attr(this.edgeLabelAttr);
		}
		var dX = this.x2 - this.x1;
		var dY = this.y2 - this.y1;
		var angle = Math.atan2(dY, dX) * 180 / Math.PI;
		if (angle > 90) {
			textLabel.transform('t-6,-6r' + (angle + 180));
		}
		else {
			textLabel.transform('t6,-6r' + angle);
		}
		return true;
	};

	function getObjectNode(message, id) {
		for (var i = 0; i < message.length; i++) {
			if (message[i].id === id) {
				return new Node(message[i]);
			}
		}
		return null;
	};

	function PaintDelegate(model) {
		this._model = model;
		this.handleError = function(Error) {
			model.messenger.error.publish(Error);
		};
		return this;
	};

	PaintDelegate.prototype.update = function(message) {
		var settings = new sm.type.Config();
		this._model.system.get.config(settings);

		var json = message.value;
		if (typeof json === 'undefined') {
			return false;
		}
		if (sm.typeMask(json, { length : true, sort : 'function' } ) !== null) {
			sm.error(new Error('Cannot determine the JSON type; expecting an array (or comparable object) of node objects but received ' + json), this);
		}
		var paper = new sm.type.NamedValue('sm.raphaeljs', 'paper', null);
		this._model.get.publish(paper);
		paper.value.clear();
		var edges = [];
		for(var i = 0; i < json.length; i++) {
			var node = new Node(json[i], paper.value, settings.shapeAttr || {}, settings.shapeLabelAttr || {});
			for (var j = 0; j < node.edges.length; j++) {
				var objectNode = getObjectNode(json, node.edges[j].id);
				if (objectNode !== null && typeof objectNode.shape.x != 'undefined' && typeof objectNode.shape.y !== 'undefined' ) {
					var edge = new Edge(node, objectNode, j, paper.value, settings.lineAttr || {}, settings.edgeLabelAttr || {});
					this._model.connect.publish(edge);
				}
			}
			this._model.insert.publish(node);
		}
	};

	var activator = function(model) {
		var delegate = new PaintDelegate(model);
		model.paintNodes.subscribe(function(message) { return delegate; });
		model.connect.subscribe(function(message) { return message; });
		model.insert.subscribe(function(message) { return message; });
	};

	ontology.registerActivator(activator, ['sm.channels', 'sm.raphaeljs']);

	try {
		sm.ontology.extendedBy(ontology);
	}
	catch (error) {
		sm.error(new Error('Could not extend the smallmachine.ontology property with the \'sm.nodes\' ontology: ' + error.message + '\n' + error.stack));
	}
}(smallmachine));

