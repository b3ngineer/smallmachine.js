;(function(sm, $, raphael) {
	'use strict';

	var ontology = new sm.Ontology('sm.treelayout');

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
		this.defaultWidth = 60;
		this.defaultNodeMargin = 40;
		this.defaultTreeMargin = 80;
		this.root = nodeList[0];
		this.size = { height : 0, width : 0, left : 0, right : 0 } ;

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
			nodeList[i].vert = 100; // minimum distance

			if (typeof nodeList[i].width === 'undefined') {
				nodeList[i].width = this.defaultWidth;
			}
			else {
				nodeList[i].width = parseFloat(nodeList[i].width);
			}
			if (typeof nodeList[i].height !== 'undefined') {
				nodeList[i].height = parseFloat(nodeList[i].height);
				if (nodeList[i].height > 100) {
					nodeList[i].vert = nodeList[i].height;
				}
			}
			if (typeof nodeList[i].children === 'undefined') {
				nodeList[i].children = [];
			}
			if (typeof nodeList[i].edges !== 'undefined') {
				for (var j = 0; j < nodeList[i].edges.length; j++) {
					var child = this._getNodeFromIndex(nodeList[i].edges[j].id, nodeList);
					if (typeof child.parentNodeId === 'undefined' || child.parentNodeId == null) {
						child.parentNodeId = nodeList[i].id;
						child.num = j;
						nodeList[i].children.push(child);
					}
				}
			}
			for (var k = 0; k < nodeList[i].children.length; k++) {
				nodeList[i].children[k].leftMostSiblingNode = nodeList[i].children[0];
				if (k < 1) {
					continue;
				}
				nodeList[i].children[k].leftSiblingNode = nodeList[i].children[k - 1];
			}
			if (typeof nodeList[i].isLeaf === 'undefined') {
				nodeList[i].__proto__ = TreeNode.prototype;
				sm.alsoBehavesLike(nodeList[i], TreeNode.prototype);
			}
		}
		if (typeof this.root.parentNodeId !== 'undefined') {
			sm.error(new Error('Aborting; An infinite loop may occur because the root node has a value for parentNodeId (which is set to ' + this.root.parentNodeId + ')'));
		}
	}

	TreeLayout.prototype.walk = function(centerX) {
		this.firstWalk(this.root);
		this.secondWalk(this.root, -this.root.prelim, 0, 0, centerX);
		this.size.width = -1*(this.size.left - this.size.right);
	};

	TreeLayout.prototype._name = 'TreeLayout';

	TreeLayout.prototype._getNodeFromIndex = function(nodeId, nodeList) {
		if (typeof this.nodeIndex[nodeId] !== 'undefined') {
			return this.nodeIndex[nodeId];
		}
		for (var i = nodeList.length - 1; i >= 0; i--) {
			if (typeof this.nodeIndex[nodeList[i].id] === 'undefined') {
				this.nodeIndex[nodeList[i].id] = nodeList[i];	
			}
			if (nodeList[i].id === nodeId) {
				return nodeList[i];
			}
		}
	};

	TreeLayout.prototype.getSpacing = function(leftNode, rightNode, siblings) {
		var spacing = siblings ? this.defaultNodeMargin : this.defaultTreeMargin; 
		return spacing + (0.5 * (leftNode.width + rightNode.width));
	};

	TreeLayout.prototype.firstWalk = function(node) {
		if (node.isLeaf()) {
			var leftSibling = node.leftSibling();
			if (leftSibling === null) {
				node.prelim = 0;
			}
			else {
				node.prelim = leftSibling.prelim + this.getSpacing(leftSibling, node, true);
				if (leftSibling.vert > node.vert) {
					node.vert = leftSibling.vert;
				}
			}
		}
		else {
			var defaultAncestor = node.leftMostChild();
			for (var i = 0; i < node.children.length; i++) {
				this.firstWalk(node.children[i]);
				defaultAncestor = this.apportion(node.children[i], defaultAncestor);
			}

			//this.executeShifts(node);

			var midpoint = 0.5*(node.leftMostChild().prelim + node.rightMostChild().prelim);
			var leftSibling = node.leftSibling();
			if (leftSibling !== null) {
				node.prelim = leftSibling.prelim + this.getSpacing(leftSibling, node, true);
				node.mod = node.prelim - midpoint;
				if (leftSibling.vert > node.vert) {
					node.vert = leftSibling.vert;
				}
			}
			else {
				node.prelim = midpoint;
			}
		}
	};

	TreeLayout.prototype.apportion = function(node, defaultAncestor) {
		var leftSibling = node.leftSibling();
		if (leftSibling !== null) {
			var insideRightNode = node,
				outsideRightNode = node,
				insideLeftNode = leftSibling,
				outsideLeftNode = node.leftMostSibling(),
				sumInsideRight = insideRightNode.mod,
				sumOutsideRight = outsideRightNode.mod,
				sumInsideLeft = insideLeftNode.mod,
				sumOutsideLeft = outsideLeftNode.mod,
				nextRight = this.nextRight(insideLeftNode),
				nextLeft = this.nextLeft(insideRightNode);

			while (nextRight !== null && nextLeft !== null) {
				insideLeftNode = nextRight;
				insideRightNode = nextLeft;
				outsideLeftNode = this.nextLeft(outsideLeftNode);
				outsideRightNode = this.nextRight(outsideRightNode);
				outsideRightNode.ancestor = node;

				var shift = (insideLeftNode.prelim + sumInsideLeft)
					- (insideRightNode.prelim + sumInsideRight)
					+ this.getSpacing(insideLeftNode, insideRightNode, false);

				if (shift > 0) {
					this.moveSubtree(this.ancestor(insideLeftNode, node, defaultAncestor), node, shift);
					sumInsideRight += shift;
					sumOutsideRight += shift;
				}

				sumInsideLeft += insideLeftNode.mod;
				sumInsideRight += insideRightNode.mod;
				sumOutsideLeft += outsideLeftNode.mod;
				sumOutsideRight += outsideRightNode.mod; 

				nextRight = this.nextRight(insideLeftNode);
				nextLeft = this.nextLeft(insideRightNode);
			}

			if (nextRight !== null && this.nextRight(outsideRightNode) === null) {
				outsideRightNode.thread = nextRight;	
				outsideRightNode.mod += sumInsideLeft - sumOutsideRight;
			}

			if (nextLeft !== null && this.nextLeft(outsideLeftNode) === null) {
				outsideLeftNode.thread = nextLeft;
				outsideLeftNode.mod += sumInsideRight - sumOutsideLeft;
				defaultAncestor = node;
			}
		}
		return defaultAncestor;
	};

	var llll = 0;

	TreeLayout.prototype.moveSubtree = function(leftRoot, rightRoot, shift) {
		if (++llll > 6) return;
		var subtrees = rightRoot.num - leftRoot.num;
		rightRoot.change = (rightRoot.change - shift) / subtrees; 
		rightRoot.shift += shift;
		leftRoot.change = (leftRoot.change + shift) / subtrees;
		rightRoot.prelim += shift;
		rightRoot.mod += shift;
	};

	TreeLayout.prototype.executeShifts = function(node) {
		var shift = 0,
			change = 0;

		for (var i = node.children.length - 1; i >= 0; i--) {
			var child = node.children[i];
			child.prelim += shift;
			child.mod += shift;
			change += child.change;
			shift += child.shift + change;
		}
	};

	TreeLayout.prototype.secondWalk = function(node, mod, level, vert, centerX) {
		if (typeof centerX === 'undefined') {
			centerX = 0;
		}
		node.x = node.prelim + mod + centerX;
		var farLeft = node.x - node.width - this.defaultNodeMargin;
		var farRight = node.x + node.width + this.defaultNodeMargin;
		if (farLeft < this.size.left) {
			this.size.left = farLeft;
		}
		else if (farRight > this.size.right) {
			this.size.right = farRight;
		}

		vert = vert + node.vert * 0.5;
		node.y = (level++ * this.defaultNodeMargin) + vert;

		if (node.y + node.height > this.size.height) {
			this.size.height = node.y + node.height;
		}

		vert = vert + node.vert * 0.5;
		for (var i = 0, numChildren = node.children.length; i < numChildren; i++) {
			this.secondWalk(node.children[i], mod + node.mod, level, vert, centerX);
		}
	};

	TreeLayout.prototype.shift = function(x,y,node) {
		if (typeof node === 'undefined') {
			node = this.root;
		}
		node.x += x;
		node.y += y;
		for (var i = 0, numChildren = node.children.length; i < numChildren; i++) {
			this.shift(x,y,node.children[i]);
		}
	};

	TreeLayout.prototype.nextRight = function(node) {
		var rightMostChild = node.rightMostChild();
		return (rightMostChild !== null) ? rightMostChild : node.thread;
	};

	TreeLayout.prototype.nextLeft = function(node) {
		var leftMostChild = node.leftMostChild();
		return (leftMostChild !== null) ? leftMostChild : node.thread;
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
					var root = new sm.type.NamedValue('sm.treelayout', 'root', null);
					model.get.publish(root);
					var paper = new sm.type.NamedValue('sm.raphaeljs', 'paper', null);
					model.get.publish(paper);
					//TODO: add config support
					var config = {};
					var layout = new sm.type.TreeLayout(message.value, root.value, config);
					if (paper.value !== null) {
						layout.walk(paper.value.width / 2);
						paper.value.setSize(layout.size.width, layout.size.height);
						if (layout.size.left < 0) {
							layout.shift(-1*(layout.size.left),0);
						}
					}
					else {
						layout.walk();
					}
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
