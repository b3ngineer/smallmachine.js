;(function(sm) {
	var ontology = new sm.Ontology('sm.nodes');

	ontology.addTerm('task');
	ontology.addTerm('insert');
	ontology.addTerm('connect');
	ontology.addTerm('set');
	ontology.addTerm('get');
	ontology.addTerm('paint');
	ontology.paint.isA(ontology.task);
	ontology.insert.isA(ontology.task);
	ontology.connect.isA(ontology.task);
	ontology.set.isA(ontology.task);
	ontology.get.isA(ontology.task);

	var Node = function(item, paper, shapeAttr) {
		this.id = item.id || (function() {
			return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
				var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
				return v.toString(16);
			});
		})();
		this.width = parseFloat(item.width) || 50;
		this.height = parseFloat(item.height) || 50;
		this.y = parseFloat(item.y);
		this.x = parseFloat(item.x);
		this.edges = item.edges || [];
		this.label = item.label || this.id;
		this.paper = paper;
		this.shapeAttr = shapeAttr;
		return this;
	};

	Node.prototype.update = function(message) {
		var element = this.paper.circle(this.x,
									 	this.y,
									 	this.width / 2,
									 	this.height / 2);
		element.id = this.id;
		if (typeof this.shapeAttr === 'function') {
			element.attr(this.shapeAttr(this.label));
		}
		else {
			element.attr(this.shapeAttr);
		}
		this.paper.text(this.x, this.y, this.label);
		return true;
	};

	var Edge = function(a, b, index, paper, lineAttr, textLabelAttr) {
		this.id1 = a.id;
		this.id2 = b.id;
		this.x1 = parseFloat(a.x);
		this.y1 = parseFloat(a.y);
		this.x2 = parseFloat(b.x);
		this.y2 = parseFloat(b.y);
		this.label = a.edges[index].label || '';
		this.paper = paper;
		this.lineAttr = lineAttr;
		this.textLabelAttr = textLabelAttr;
		return this;
	};

	Edge.prototype.update = function(message) {
		var line = this.paper.path( ["M", this.x1, this.y1, "L", this.x2, this.y2] );
		if (typeof this.lineAttr === 'function') {
			line.attr(this.lineAttr(this.label));
		}
		else {
			line.attr(this.lineAttr);
		}
		var a = this.x1 - this.x2;
		var b = this.y1 - this.y2;
		var cX = (this.x1 + this.x2) / 2;
		var cY = (this.y1 + this.y2) / 2;
		var textLabel = this.paper.text(cX, cY, this.label);
		if (typeof this.textLabelAttr === 'function') {
			textLabel.attr(this.textLabelAttr(this.label));
		}
		else {
			textLabel.attr(this.textLabelAttr);
		}
		var dX = this.x2 - this.x1;
		var dY = this.y2 - this.y1;
		var angle = Math.atan2(dY, dX) * 180 / Math.PI;
		textLabel.transform('r' + angle);
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
		var settings = new sm.type.Config();
		model.system.get.config(settings);
		this.settings = settings;
		this.handleError = function(Error) {
			model.messenger.error.publish(Error);
		};
		return this;
	};

	PaintDelegate.prototype.update = function(message) {
		var json = message.value;
		if (typeof json === 'undefined') {
			return false;
		}
		if (sm.typeMask(json, { length : true, sort : 'function' } ) !== null) {
			sm.error(new Error('Cannot determine the JSON type; expecting an array (or comparable object) of node objects but received ' + json), this);
		}
		var paper = new sm.type.NamedValue('sm.raphaeljs', 'paper', null);
		this._model.get.publish(paper);
		var edges = [];
		for(var i = 0; i < json.length; i++) {
			var node = new Node(json[i], paper.value, this.settings.shapeAttr || {});
			for (var j = 0; j < node.edges.length; j++) {
				var objectNode = getObjectNode(json, node.edges[j].id);
				if (objectNode !== null) {
					var edge = new Edge(node, objectNode, j, paper.value, this.settings.lineAttr || {}, this.settings.textLabelAttr || {});
					this._model.connect.publish(edge);
				}
			}
			this._model.insert.publish(node);
		}
	};

	var activator = function(model) {
		// default behaviors
		var delegate = new PaintDelegate(model);
		model.paint.subscribe(function(message) { return delegate; });
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

