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

	var Node = function(item, paper, shapeAttr, shapeLabelAttr) {
		this.id = item.id || sm.getGuid();
		this.width = parseFloat(item.width) || 50;
		this.height = parseFloat(item.height) || 50;
		this.y = parseFloat(item.y);
		this.x = parseFloat(item.x);
		this.edges = item.edges || [];
		this.label = item.label || this.id;
		this.paper = paper;
		this.shapeAttr = shapeAttr;
		this.shapeLabelAttr = shapeLabelAttr;
		this.data = {};
		return this;
	};

	Node.prototype.update = function(message) {
		var element = this.paper.circle(this.x,
									 	this.y,
									 	this.width / 2,
									 	this.height / 2);
		element.id = this.id;
		if (typeof this.shapeAttr === 'function') {
			this.shapeAttr(element, this);
		}
		else {
			element.attr(this.shapeAttr);
		}
		var shapeText = this.paper.text(this.x, this.y, this.label);
		if (typeof this.shapeLabelAttr === 'function') {
			this.shapeLabelAttr(shapeText, this);
		}
		else {
			shapeText.attr(this.shapeLabelAttr);
		}
		return true;
	};

	var Edge = function(a, b, index, paper, lineAttr, edgeLabelAttr) {
		this.id1 = a.id;
		this.id2 = b.id;
		this.r1 =  a.width / 2;
		this.r2 =  b.width / 2;
		this.x1 = parseFloat(a.x);
		this.y1 = parseFloat(a.y);
		this.x2 = parseFloat(b.x);
		this.y2 = parseFloat(b.y);
		this.label = a.edges[index].label || '';
		this.paper = paper;
		this.lineAttr = lineAttr;
		this.edgeLabelAttr = edgeLabelAttr;
		this.data = {};
		return this;
	};

	Edge.prototype.update = function(message) {
		var d = Math.sqrt(Math.pow((this.x2 - this.x1), 2) + Math.pow((this.y2 - this.y1), 2));
		var r1 = this.r1 / d;
		var r2 = (d - this.r2) / d;
		var x3 = r1 * this.x2 + (1 - r1) * this.x1;
		var y3 = r1 * this.y2 + (1 - r1) * this.y1;
		var x4 = r2 * this.x2 + (1 - r2) * this.x1;
		var y4 = r2 * this.y2 + (1 - r2) * this.y1;

		var line = this.paper.path( ["M", x3, y3, "L", x4, y4] );
		if (typeof this.lineAttr === 'function') {
			this.lineAttr(line, this);
		}
		else {
			line.attr(this.lineAttr);
		}
		var a = this.x1 - this.x2;
		var b = this.y1 - this.y2;
		var cX = (this.x1 + this.x2) / 2 
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

	var getObjectNode = function(message, id) {
		for (var i = 0; i < message.length; i++) {
			if (message[i].id === id) {
				return message[i];
			}
		}
		return null;
	};

	var PaintDelegate = function(model) {
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
				if (objectNode !== null && typeof objectNode.x != 'undefined' && typeof objectNode.y !== 'undefined' ) {
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

