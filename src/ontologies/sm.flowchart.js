;(function(sm, $, raphael) {
	'use strict';

	var ontology = new sm.Ontology('sm.flowchart');

	ontology.addTerm('paint');
	ontology.addTerm('get');

	function TreeNode() {
		return this;
	}

	TreeNode.prototype.leftMostChild = function() {
		return this.children[0];
	};

	TreeNode.prototype.rightMostChild = function() {
		if (this.children.length < 1) {
			return this.children[0];
		}
		return this.children[this.children.length - 1];
	};

	TreeNode.prototype.leftSibling = function() {
		return this.leftSiblingNode || null;
	};

	TreeNode.prototype.isLeaf = function() {
		return this.children.length === 0;
	};

	function TreeLayout(nodeList, rootId) {
		this.nodeIndex = {};
		var root = nodeList[0];
		for (var i = 0; i < nodeList.length; i++) {
			if (nodeList[i].id === rootId) {
				root = nodeList[i];
			}
			nodeList[i].prelim = 0;
			nodeList[i].mod = 0;
			nodeList[i].thread = null;
			nodeList[i].ancestor = nodeList[i];
			this.nodeIndex[nodeList[i].id] = nodeList[i];
			if (typeof nodeList[i].children === 'undefined') {
				nodeList[i].children = [];
			}
			if (typeof nodeList[i].edges !== 'undefined') {
				for (var j = 0; j < nodeList[i].edges.length; j++) {
					nodeList[i].children.push(this._getNodeFromIndex(nodeList[i].edges[j].id, i, nodeList));
				}
			}
			for (var k = 1; k < nodeList[i].children.length; k++) {
				nodeList[i].children[k].leftSiblingNode = nodeList[i].children[k - 1];
			}
			if (typeof nodeList[i].prototype === 'undefined') {
				nodeList[i].__proto__ = TreeNode.prototype;
			}
			else {
				sm.alsoBehavesLike(nodeList[i], TreeNode);
			}
		}
		this.firstWalk(root);
		this.secondWalk(root, -root.prelim);
	}

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
			var midpoint = 0.5*(node.leftMostChild().prelim + node.rightMostChild().prelim);
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

	TreeLayout.prototype.apportion = function(node, defaultAncestor) {
		var leftSibling = node.leftSibling();
		if (leftSibling !== null) {
			var rightInsideEdge = node;
			var rightOutsideEdge = node; 
			var leftInsideEdge = leftSibling;
			var leftOutsideEdge = rightInsideEdge.leftSibling();
			var sumOfRightInsideEdge = rightInsideEdge.mod;
			var sumOfRightOutsideEdge = rightOutsideEdge.mod;
			var sumOfLeftInsideEdge = leftInsideEdge.mod;
			var sumOfLeftOutsideEdge = leftOutsideEdge.mod;
			while (this.nextRight(leftInsideEdge) !== null && this.nextLeft(rightInsideEdge) !== null) {
				leftInsideEdge = this.nextRight(leftInsideEdge);
				rightInsideEdge = this.nextLeft(rightInsideEdge);
				leftOutsideEdge = this.nextLeft(leftOutsideEdge);
				rightOutsideEdge = this.nextRight(rightOutsideEdge);
				leftInsideEdge.ancestor = node;
				var shift = (leftInsideEdge.prelim + sumOfLeftInsideEdge) - (rightInsideEdge + sumOfRightInsideEdge) + distance; // TODO
				if (shift > 0) {
					this.moveSubtree(this.ancestor(rightInsideEdge, node, defaultAncestor), node, shift);
					sumOfRightInsideEdge = sumOfRightInsideEdge + shift;
					sumOfRightOutsideEdge = sumOfRightOutsideEdge + shift;
				}
				sumOfLeftInsideEdge = sumOfLeftInsideEdge + leftInsideEdge.mod;
				sumOfRightInsideEdge = sumOfRightInsideEdge + rightInsideEdge.mod;
				sumOfLeftOutsideEdge = sumOfLeftOutsideEdge + leftOutsideEdge.mod;
				sumOfRightOutsideEdge = sumOfRightOutsideEdge + rightOutsideEdge.mod; 
			}
			if (this.nextRight(leftInsideEdge) !== null && this.nextRight(rightOutsideEdge) === null) {
				rightOutsideEdge.thread = this.nextLeft(leftOutsideEdge);	
				rightOutsideEdge.mod = rightOutsideEdge.mod + sumOfLeftInsideEdge - sumOfRightOutsideEdge;
			}
			if (this.nextLeft(rightInsideEdge) !== null && this.nextLeft(leftOutsideEdge) === null) {
				leftOutsideEdge.thread = this.nextLeft(rightInsideEdge);
				leftOutsideEdge.mod = leftOutsideEdge.mod + sumOfRightInsideEdge - sumOfLeftOutsideEdge;
				defaultAncestor = node;
			}
		}
	};

	TreeLayout.prototype.executeShifts = function(node) {
	};

	TreeLayout.prototype.secondWalk = function(node) {
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

	TreeLayout.prototype.ancestor = function(rightInsideEdge, node, defaultAncestor) {
	};

	function activator(model) {
		model.paint.subscribe(function(message) {
			if (sm.typeMask(message.value, { length : true, sort : 'function' } ) === null) {
				return function(mesage) {
					var root = new sm.type.NamedValue('sm.flowchart', 'root', null);
					model.get.publish(root);
					new TreeLayout(message.value, root.value);
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
