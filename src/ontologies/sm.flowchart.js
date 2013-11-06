;(function(sm, $, raphael) {
	'use strict';

	var ontology = new sm.Ontology('sm.flowchart');

	ontology.addTerm('paint');
	ontology.addTerm('get');

	function TreeNode() {
		this.leftSiblingNode = null;
		return this;
	}

	TreeNode.prototype.leftMostChild = function() {
		return this.children[0] || null;
	};

	TreeNode.prototype.rightMostChild = function() {
		if (this.children.length < 1) {
			return this.children[0] || null;
		}
		return this.children[this.children.length - 1];
	};

	TreeNode.prototype.leftSibling = function() {
		return this.leftSiblingNode || null;
	};

	TreeNode.prototype.leftMostSibling = function() {
		return this.leftMostSiblingNode || null;
	};

	TreeNode.prototype.isLeaf = function() {
		return this.children.length === 0;
	};

	function TreeLayout(nodeList, rootId) {
		this.nodeIndex = {};
		this.distance = 120;
		this.root = nodeList[0];
		for (var i = 0; i < nodeList.length; i++) {
			if (nodeList[i].id === rootId) {
				this.root = nodeList[i];
			}
			nodeList[i].prelim = 0;
			nodeList[i].mod = 0;
			nodeList[i].thread = null;
			nodeList[i].ancestor = nodeList[i];
			nodeList[i].shift = 0;
			nodeList[i].change = 0;
			nodeList[i].num = nodeList[i].num || 0;
			this.nodeIndex[nodeList[i].id] = nodeList[i];
			if (typeof nodeList[i].children === 'undefined') {
				nodeList[i].children = [];
			}
			if (typeof nodeList[i].edges !== 'undefined') {
				for (var j = 0; j < nodeList[i].edges.length; j++) {
					var child = this._getNodeFromIndex(nodeList[i].edges[j].id, i, nodeList);
					child.parentNodeId = nodeList[i].id;
					child.num = j;
					nodeList[i].children.push(child);
				}
			}
			for (var k = 0; k < nodeList[i].children.length; k++) {
				nodeList[i].children[k].leftMostSiblingNode = nodeList[i].children[0];
				if (k < 1) {
					continue;
				}
				nodeList[i].children[k].leftSiblingNode = nodeList[i].children[k - 1];
			}
			if (typeof nodeList[i].prototype === 'undefined') {
				nodeList[i].__proto__ = TreeNode.prototype;
			}
			else {
				sm.alsoBehavesLike(nodeList[i], TreeNode);
			}
		}
	}

	TreeLayout.prototype.walk = function() {
		this.firstWalk(this.root);
		this.secondWalk(this.root, -this.root.prelim, 0);
	};

	TreeLayout.prototype._name = 'TreeLayout';

	TreeLayout.prototype._getNodeFromIndex = function(nodeId, startAt, nodeList) {
		if (typeof this.nodeIndex[nodeId] !== 'undefined') {
			return this.nodeIndex[nodeId];
		}
		for (var i = startAt; i < nodeList.length; i++) {
			if (typeof this.nodeIndex[nodeList[i].id] === 'undefined') {
				this.nodeIndex[nodeList[i].id] = this.nodeIndex[i];	
			}
			if (nodeList[i].id === nodeId) {
				return nodeList[i];
			}
		}
	};

	TreeLayout.prototype.firstWalk = function(node) {
		//console.log('calling first walk on %s', node.label);
		if (node.isLeaf()) {
			var leftSibling = node.leftSibling();
			if (leftSibling === null) {
				node.prelim = 0;
			}
			else {
				node.prelim = leftSibling.prelim + this.distance;
			}
		}
		else {
			var defaultAncestor = node.leftMostChild();
			for (var i = 0; i < node.children.length; i++) {
				this.firstWalk(node.children[i]);
				defaultAncestor = this.apportion(node.children[i], defaultAncestor);
			}
			this.executeShifts(node);
			var midpoint = 0.5*(node.leftMostChild().prelim + node.rightMostChild().prelim);
			var leftSibling = node.leftSibling();
			if (leftSibling !== null) {
				node.prelim = leftSibling.prelim + this.distance;
				node.mod = node.prelim - midpoint;
				//console.log("%s %d %d", node.label, node.prelim, node.mod);
			}
			else {
				node.prelim = midpoint;
				//console.log("%s %d %d", node.label, node.prelim, node.mod);
			}
		}
	};

	TreeLayout.prototype.apportion = function(node, defaultAncestor) {
		var leftSibling = node.leftSibling();
		//console.log('calling apportion on %s with leftSibling of %o', node.label, leftSibling);
		if (leftSibling !== null) {
			var insideRightNode = node;
			var outsideRightNode = node;
			var insideLeftNode = leftSibling;
			var outsideLeftNode = node.leftMostSibling();
			var sumInsideRight = insideRightNode.mod;
			//console.log("sumInsideRight %d", sumInsideRight);
			var sumOutsideRight = outsideRightNode.mod;
			var sumInsideLeft = insideLeftNode.mod;
			var sumOutsideLeft = outsideLeftNode.mod;

			var nextRight = this.nextRight(insideLeftNode);
			var nextLeft = this.nextLeft(insideRightNode);
			//console.log("%o %o %o", insideLeftNode.label, nextRight, insideRightNode.label, nextLeft);
			while (nextRight !== null && nextLeft !== null) {
				insideLeftNode = nextRight;
				insideRightNode = nextLeft;
				outsideLeftNode = this.nextLeft(outsideLeftNode);
				outsideRightNode = this.nextRight(outsideRightNode);
				insideLeftNode.ancestor = node;
				var shift = (insideLeftNode.prelim + sumInsideLeft) - (insideRightNode.prelim + sumInsideRight) + this.distance;
				//console.log('shift %d + %d - %d + %d + %d = %d', insideLeftNode.prelim, sumInsideLeft, insideRightNode.prelim, sumInsideRight, this.distance, shift);
				if (shift > 0) {
					this.moveSubtree(this.ancestor(insideRightNode, node, defaultAncestor), node, shift);
					sumInsideRight += shift;
					sumOutsideRight += shift;
				}
				sumInsideLeft += insideLeftNode.mod;
				sumInsideRight += insideRightNode.mod;
				sumOutsideLeft += outsideLeftNode.mod;
				sumOutsideRight += outsideRightNode.mod; 
				nextRight = this.nextRight(insideLeftNode);
				nextLeft = this.nextLeft(insideRightNode);
				//console.log("%o %o %o", insideLeftNode.label, nextRight, insideRightNode.label, nextLeft);
			}
			if (this.nextRight(insideLeftNode) !== null && this.nextRight(outsideRightNode) === null) {
				//console.log('adding thread to %o', outsideRightNode.label);
				outsideRightNode.thread = this.nextLeft(outsideLeftNode);	
				outsideRightNode.mod += sumInsideLeft - sumOutsideRight;
				//console.log("%s %d %d", outsideRightNode.label, outsideRightNode.prelim, outsideRightNode.mod);
			}
			if (this.nextLeft(insideRightNode) !== null && this.nextLeft(outsideLeftNode) === null) {
				//console.log('adding thread to %o', outsideLeftNode.label);
				outsideLeftNode.thread = this.nextLeft(insideRightNode);
				outsideLeftNode.mod += sumInsideRight - sumOutsideLeft;
				//console.log("%s %d %d", outsideLeftNode.label, outsideLeftNode.prelim, outsideLeftNode.mod);
				defaultAncestor = node;
			}
		}
		return defaultAncestor;
	};

	TreeLayout.prototype.moveSubtree = function(leftRoot, rightRoot, shift) {
		//console.log('moveSubtree on %o', leftRoot.label);
		var subtrees = rightRoot.num - leftRoot.num;
		rightRoot.change -= shift / subtrees; 
		rightRoot.shift += shift;
		leftRoot.change += shift / subtrees;
		rightRoot.prelim += shift;
		rightRoot.mod += shift;
	};

	TreeLayout.prototype.executeShifts = function(node) {
		//console.log('executeShifts on %o', node.label);
		var shift = 0;
		var change = 0;
		for (var i = (node.children.length - 1); i >= 0; i--) {
			var child = node.children[i];
			child.prelim += shift;
			child.mod += shift;
			change += child.change;
			shift += child.shift + change;
			//console.log("%s %d %d", child.label, child.prelim, child.mod);
		}
	};

	TreeLayout.prototype.secondWalk = function(node, mod, level) {
		node.x = node.prelim + mod + 400;
		node.y = level++ * this.distance + 100;
		for (var i = 0; i < node.children.length; i++) {
			this.secondWalk(node.children[i], mod + node.mod, level);
		}
	};

	TreeLayout.prototype.nextRight = function(node) {
		var rightMostChild = node.rightMostChild();
		if (rightMostChild !== null) {
			return rightMostChild;
		}
		return node.thread;
	};

	TreeLayout.prototype.nextLeft = function(node) {
		var leftMostChild = node.leftMostChild();
		if (leftMostChild !== null) {
			return leftMostChild;
		}
		return node.thread;
	};

	TreeLayout.prototype.ancestor = function(left, right, defaultAncestor) {
		if (left.parentNodeId === right.parentNodeId) {
			return left.ancestor;
		}
		return defaultAncestor;
	};

	TreeLayout.prototype.areSiblings = function(a, b) {
		return a.parentNodeId === b.parentNodeId;
	};

	sm.type.extendedBy(TreeLayout);

	function activator(model) {
		model.paint.subscribe(function(message) {
			if (sm.typeMask(message.value, { length : true, sort : 'function' } ) === null) {
				return function(mesage) {
					var root = new sm.type.NamedValue('sm.flowchart', 'root', null);
					model.get.publish(root);
					var layout = new sm.type.TreeLayout(message.value, root.value);
					layout.walk();
					return false;
				};
			}
		});
	}

	ontology.registerActivator(activator, ['sm.channels', 'sm.nodes', 'sm.raphaeljs']);

	try {
		sm.ontology.extendedBy(ontology);
	}
	catch (error) {
		sm.error(new Error('Could not extend the smallmachine.ontology property with the \'sm.nodes\' ontology: ' + error.message + '\n' + error.stack));
	}
}(smallmachine, jQuery, Raphael));
