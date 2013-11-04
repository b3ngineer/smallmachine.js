describe('sm.flowchart', function() {

	var testMessage = {
		value : 
		[
			{ 'id' : '1', 'edges' : [ { 'id' : '2', 'label' : 'isA' }, { 'id' : '3', 'label' : 'isA' } ], 'height' : 60, 'width' : 60, 'label' : 'A' },
			{ 'id' : '2', 'shape' : 'rectangle', 'edges' : [ { 'id' : '4', 'label' : 'hasProperty' }, { 'id' : '5', 'label' : 'alsoHasProperty' }, { 'id' : '6', 'label' : 'relatesTo' } ],  'height' : '60', 'width' : '60', 'label' : 'B' },
			{ 'id' : '3', 'shape' : 'diamond', 'edges' : [ {'id' : '7', 'label' : 'tests' } ],  'height' : 60, 'width' : 100, 'label' : 'C' },
			{ 'id' : '4', 'shape' : 'triangle', 'edges' : [],  'height' : 60, 'width' : 80, 'label' : 'D' },
			{ 'id' : '5', 'edges' : [],  'height' : 60, 'width' : 60, 'label' : 'E' },
			{ 'id' : '6', 'edges' : [],  'height' : 60, 'width' : 60, 'label' : 'F' },
			{ 'id' : '7', 'edges' : [ { 'id' : '8', 'label' : 'isA' }, { 'id' : '9', 'label' : 'isA' } ],  'height' : 60, 'width' : 60, 'label' : 'G' },
			{ 'id' : '8', 'edges' : [ {'id':'10', 'label':'isA'} ],  'height' : 60, 'width' : 90, 'label' : 'H' },
			{ 'id' : '9', 'edges' : [],  'height' : 60, 'width' : 70, 'label' : 'I' },
			{ 'id' : '10', 'edges' : [],  'height' : 60, 'width' : 60, 'label' : 'J' }
		]
	};
	var actual = new smallmachine.type.TreeLayout(testMessage.value, '1');
	actual.walk();

	it('should initialize children in a node list according to the alias of \'edges\' the behavior of the TreeLayout', function() {
		expect(testMessage.value[0].children).toBeDefined();
		expect(testMessage.value[0].children.length).toBe(2);
	});

	it('should find the root node in the node list according to the specified id', function() {
		expect(actual.root).toBeDefined();
		expect(actual.root.id).toBe('1');
	});

	it('should indicate that the root node is not a leaf', function() {
		expect(actual.root.isLeaf()).toBe(false);
	});

	it('should indicate that the \'B\' node is the leftmost child of \'A\'', function() {
		expect(actual.root.leftMostChild().label).toBe('B');
	});

	it('should indicate that the \'C\' node is the rightmost child of \'A\'', function() {
		expect(actual.root.rightMostChild().label).toBe('C');
	});

	it('should indicate that \'F\' is the rightmost child of the leftmost child of \'A\'', function() {
		expect(actual.root.leftMostChild().rightMostChild().label).toBe('F');
	});

	it('should indicate that \'F\' is a leaf', function() {
		expect(actual.root.leftMostChild().rightMostChild().isLeaf()).toBe(true);
	});

	it('should indicate that \'G\' is the rightmost child of \'C\'', function() {
		expect(actual.root.rightMostChild().rightMostChild().label).toBe('G');
	});

	it('should indicate that \'G\' is also the leftmost child of \'C\'', function() {
		expect(actual.root.rightMostChild().leftMostChild().label).toBe('G');
	});

	it('should indicate that \'A\' has no left sibling', function() {
		expect(actual.root.leftSibling()).toBe(null);
	});

	it('should indicate that \'B\' has no left sibling', function() {
		expect(actual.root.leftMostChild().leftSibling()).toBe(null);
	});

	it('should indicate that \'C\' has left sibling \'B\'', function() {
		expect(actual.root.rightMostChild().leftSibling().label).toBe('B');
	});

	it('should indicate that \'D\' has no left sibling', function() {
		expect(actual.root.leftMostChild().leftMostChild().leftSibling()).toBe(null);
	});

	it('should indicate that \'E\' has left sibling \'D\'', function() {
		expect(actual.root.leftMostChild().children[1].leftSibling().label).toBe('D');
	});

	it('should indicate that \'F\' has left sibling \'E\'', function() {
		expect(actual.root.leftMostChild().rightMostChild().leftSibling().label).toBe('E');
	});

	it('should indicate that \'B\' is the successor of \'A\' when calling nextLeft', function() {
		expect(actual.nextLeft(actual.root)).not.toBe(0);
		expect(actual.nextLeft(actual.root)).not.toBe(null);
		expect(actual.nextLeft(actual.root).label).toBe('B');
	});

	it('should indicate that \'D\' is the successor of \'B\' when calling nextLeft', function() {
		expect(actual.nextLeft(actual.root.leftMostChild())).not.toBe(0);
		expect(actual.nextLeft(actual.root.leftMostChild())).not.toBe(null);
		expect(actual.nextLeft(actual.root.leftMostChild()).label).toBe('D');
	});

	it('should assign a thread from \'D\' to \'H\'', function() {
		expect(actual.root.leftMostChild().leftMostChild().label).toBe('D');
		expect(actual.root.leftMostChild().leftMostChild().thread.label).toBe('H');
	});

	it('should indicate that \'H\' is the successor of \'D\' when calling nextLeft', function() {
		expect(actual.nextLeft(actual.root.leftMostChild().leftMostChild())).not.toBe(0);
		expect(actual.nextLeft(actual.root.leftMostChild().leftMostChild())).not.toBe(null);
		expect(actual.nextLeft(actual.root.leftMostChild().leftMostChild()).label).toBe('H');
	});

	it('should indicate that \'J\' is the successor of \'H\' when calling nextLeft', function() {
		expect(actual.nextLeft(actual.root.rightMostChild().leftMostChild().leftMostChild())).not.toBe(0);
		expect(actual.nextLeft(actual.root.rightMostChild().leftMostChild().leftMostChild())).not.toBe(null);
		expect(actual.nextLeft(actual.root.rightMostChild().leftMostChild().leftMostChild())).toBeDefined();
		expect(actual.nextLeft(actual.root.rightMostChild().leftMostChild().leftMostChild()).label).toBe('J');
	});

	it('should indicate that \'J\' has no successor (null) when calling nextLeft', function() {
		expect(actual.nextLeft(actual.root.rightMostChild().leftMostChild().leftMostChild().leftMostChild())).toBe(null);
	});

	it('should indicate that \'C\' is the successor of \'A\' when calling nextRight', function() {
		expect(actual.nextRight(actual.root)).not.toBe(0);
		expect(actual.nextRight(actual.root)).not.toBe(null);
		expect(actual.nextRight(actual.root).label).toBe('C');
	});

	it('should indicate that \'G\' is the successor of \'C\' when calling nextRight', function() {
		expect(actual.nextRight(actual.root.rightMostChild())).not.toBe(0);
		expect(actual.nextRight(actual.root.rightMostChild())).not.toBe(null);
		expect(actual.nextRight(actual.root.rightMostChild()).label).toBe('G');
	});

	it('should indicate that \'I\' is the successor of \'G\' when calling nextRight', function() {
		expect(actual.nextRight(actual.root.rightMostChild().rightMostChild())).not.toBe(0);
		expect(actual.nextRight(actual.root.rightMostChild().rightMostChild())).not.toBe(null);
		expect(actual.nextRight(actual.root.rightMostChild().rightMostChild()).label).toBe('I');
	});

	it('should assign a thread from \'I\' to \'J\'', function() {
		expect(actual.root.rightMostChild().rightMostChild().rightMostChild().label).toBe('I');
		expect(actual.root.rightMostChild().rightMostChild().rightMostChild().thread.label).toBe('J');
	});

	it('should indicate that \'J\' is the successor of \'I\' when calling nextRight', function() {
		expect(actual.nextRight(actual.root.rightMostChild().rightMostChild().rightMostChild())).not.toBe(0);
		expect(actual.nextRight(actual.root.rightMostChild().rightMostChild().rightMostChild())).not.toBe(null);
		expect(actual.nextRight(actual.root.rightMostChild().rightMostChild().rightMostChild()).label).toBe('J');
	});

	it('should indicate that \'F\' is a sibling of \'E\' when calling areSiblings', function() {
		var F = actual.root.leftMostChild().children[2];
		var E = actual.root.leftMostChild().children[1];
		expect(actual.areSiblings(F,E)).toBe(true);
	});

	it('should indicate that \'D\' is a sibling of \'E\' when calling areSiblings', function() {
		var D = actual.root.leftMostChild().children[0];
		var E = actual.root.leftMostChild().children[1];
		expect(actual.areSiblings(D,E)).toBe(true);
	});

	it('should indicate that \'D\' is a sibling of \'F\' when calling areSiblings', function() {
		var D = actual.root.leftMostChild().children[0];
		var F = actual.root.leftMostChild().children[2];
		expect(actual.areSiblings(D,F)).toBe(true);
	});

	it('should indicate that \'G\' is not a sibling of \'F\' when calling areSiblings', function() {
		var G = actual.root.rightMostChild().children[0];
		var F = actual.root.leftMostChild().children[2];
		expect(actual.areSiblings(G,F)).toBe(true);
	});
});
