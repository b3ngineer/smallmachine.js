;(function(sm) {
	var ontology = new sm.Ontology('sm.nodes');

	ontology.addTerm('insert');
	ontology.addTerm('connect');
	ontology.addTerm('set');
	ontology.addTerm('get');
	ontology.addTerm('initialize');

	var Node = function(item, paper) {
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
		return this;
	};

	Node.prototype.update = function(message) {
		var element = this.paper.circle(this.x,
									 	this.y,
									 	this.width / 2,
									 	this.height / 2);
		element.id = this.id;
		element.attr({
			fill : '#ffffff'
		});
		this.paper.text(this.x, this.y, this.label);
		return true;
	};

	var Edge = function(a, b, index, paper) {
		this.id1 = a.id;
		this.id2 = b.id;
		this.x1 = parseFloat(a.x);
		this.y1 = parseFloat(a.y);
		this.x2 = parseFloat(b.x);
		this.y2 = parseFloat(b.y);
		this.label = a.edges[index].label || '';
		this.paper = paper;
		return this;
	};

	Edge.prototype.update = function(message) {
		this.paper.path( ["M", this.x1, this.y1, "L", this.x2, this.y2] );
		var x1 = parseFloat(this.x1);
		var y1 = parseFloat(this.y1);
		var x2 = parseFloat(this.x2);
		var y2 = parseFloat(this.y2);
		var a = x1 - x2;
		var b = y1 - y2;
		var cX = (x1 + x2) / 2;
		var cY = (y1 + y2) / 2;
		var textLabel = this.paper.text(cX, cY - 6, this.label);
		var dX = x2 - x1;
		var dY = y2 - y1;
		var angle = Math.atan2(dY, dX) * 180 / Math.PI;
		textLabel.transform('r' + angle);
		return true;
	};

	var getObjectNode = function(message, id) {
		if (typeof message.length === 'undefined') {
			throw new Error('Cannot determine the message type; expecting an array of node objects but received ' + message);
		}
		for (var i = 0; i < message.length; i++) {
		if (message[i].id === id) {
			return message[i];
		}
		}
		return null;
	};

	var InitializerDelegate = function(model) {
		this._model = model;
		return this;
	};

	InitializerDelegate.prototype.update = function(message) {
		var paper = new sm.type.NamedValue('sm.raphaeljs', 'paper', null);
		this._model.get.publish(paper);
		var edges = [];
		for(var i = 0; i < message.length; i++) {
			var node = new Node(message[i], paper.value);
			for (var j = 0; j < node.edges.length; j++) {
				var objectNode = getObjectNode(message, node.edges[j].id);
				if (objectNode !== null) {
					var edge = new Edge(node, objectNode, j, paper.value);
					this._model.connect.publish(edge);
				}
			}
			this._model.insert.publish(node);
		}
	};

	var activator = function(model) {
		var delegate = new InitializerDelegate(model);
		model.initialize.subscribe({ update : function(message) { return delegate; } });
		model.connect.subscribe({ update : function(message) { return message; } });
		model.insert.subscribe({ update : function(message) { return message; } });
	};

	ontology.registerActivator(activator, ['sm.channels', 'sm.raphaeljs'])

	try {
		sm.ontology.extendedBy(ontology);
	}
	catch (error) {
		throw new Error('Could not extend the smallmachine.ontology property with the \'sm.nodes\' ontology: ' + error.message + '\n' + error.stack);
	}
}(smallmachine));

