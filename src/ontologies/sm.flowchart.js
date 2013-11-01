;(function(sm, $, raphael) {
	var ontology = new sm.Ontology('sm.flowchart');

	ontology.addTerm('paint');
	ontology.addTerm('get');

	function TreeNode() {
		return this;
	};

	TreeNode.prototype.leftMostChild = function() {
		// initialize the children property
		return {};
	};

	TreeNode.prototype.rightMostChild = function() {
		return {};
	};

	TreeNode.prototype.leftSibling = function() {
		return null;
	};

	TreeNode.prototype.isLeaf = function() {
		return false;
	};

	function TreeLayoput(paper) {
		this.paper = paper;
		return this;
	};

	TreeLayoput.prototype.format = function(json, rootId) {
		var root = json[rootId];
		this.firstWalk(root);
		this.secondWalk(root, -root.prelim);
	};

	TreeLayoput.prototype.firstWalk = function(node) {
		node.prototype = TreeNode.prototype;
		if (node.isLeaf()) {
			node.prelim = 0;
		}
		else {
			var defaultAncestor = node.leftMostChild(); 
			for (var i = 0; i < node.children.length; i++) {
				this.firstWalk(node.children[i]);
				this.apportion(node.children[i], defaultAncestor);
			}
			this.executeShifts(node);
			var midpoint = 0.5(node.leftMostChild().prelim + node.rightMostChild().prelim); 
			var leftSibling = node.leftSibling();
			if (leftSibling !== null) {
				var distance = 0; // TODO
				node.prelim = leftSibling.prelim + distance;
				node.mod = node.prelim - midpoint;
			}
			else {
				node.prelim = midpoint;
			}
		}
	};

	TreeLayoput.prototype.apportion = function(node, ancestor) {
	};

	TreeLayoput.prototype.executeShifts = function(node) {
	};

	TreeLayoput.prototype.secondWalk = function(node) {
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
					var layout = new TreeLayoput(paper.value);
					layout.format(json, root.value);
					//format(json, root.value, layout);
					//paper.value.setSize(layout.finalWidth * 1.05, layout.finalHeight * 1.05);
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
