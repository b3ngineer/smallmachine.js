;(function(sm, $, raphael) {
	'use strict';

	var Node = function(item) {
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
		return this;
	};

	Node.prototype.update = function(hook) {
		var element = hook.context.circle(this.x,
										  this.y,
										  this.width / 2,
										  this.height / 2);
		element.id = this.id;
		element.attr({
			fill : '#ffffff'
		});
		hook.context.text(this.x, this.y, this.label);
		return true;
	};

	sm.type.extendedBy(Node, 'Node');

	var Edge = function(a, b, index) {
		this.id1 = a.id;
		this.id2 = b.id;
		this.x1 = parseFloat(a.x);
		this.y1 = parseFloat(a.y);
		this.x2 = parseFloat(b.x);
		this.y2 = parseFloat(b.y);
		this.label = a.edges[index].label || '';
		return this;
	};

	Edge.prototype.update = function(hook) {
		hook.context.path( ["M", this.x1, this.y1, "L", this.x2, this.y2] );
		var x1 = parseFloat(this.x1);
		var y1 = parseFloat(this.y1);
		var x2 = parseFloat(this.x2);
		var y2 = parseFloat(this.y2);
		var a = x1 - x2;
		var b = y1 - y2;
		var cX = (x1 + x2) / 2;
		var cY = (y1 + y2) / 2;
		var textLabel = hook.context.text(cX, cY - 6, this.label);
		var dX = x2 - x1;
		var dY = y2 - y1;
		var angle = Math.atan2(dY, dX) * 180 / Math.PI;
		textLabel.transform('r' + angle);
	};

	sm.type.extendedBy(Edge, 'Edge');

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

	var Nodes = function(model) {
		if (model.title !== 'sm.channels') {
			throw new Error('The sm.Bones functionality requires a model from the sm.channels ontology');
		}
		model.system.insert.subscribe({
			update : function(message) {
				if (typeof message.ofType !== 'function' || !message.ofType('Hook')) {
					return false;
				}
				// models are delegates
				if (typeof message.target.update === 'function') {
					return message.target;
				}
			}
		});
		model.system.initialize.subscribe({
			update : function(message) {
				// defer execution until all subscribers have been notified by the JSON result,
				// which will allow manipulation of the data prior to drawing the graph
				return function(message) {
					var width = $(window).width();
					var height = $(window).height();
					var paper = raphael('paper', width, height);
					var edges = [];
					for(var i = 0; i < message.length; i++) {
						var node = new sm.type.Node(message[i]);
						for (var j = 0; j < node.edges.length; j++) {
							var objectNode = getObjectNode(message, node.edges[j].id);
							if (objectNode !== null) {
								var edge = new sm.type.Edge(node, objectNode, j);
								model.system.insert.publish(new sm.type.Hook(edge, paper));
							}
						}
						model.system.insert.publish(new sm.type.Hook(node, paper));
					}
				};
			}
		});
		return this;
	};

	sm.type.extendedBy(Nodes, 'Nodes');
})(smallmachine, jQuery, Raphael);
