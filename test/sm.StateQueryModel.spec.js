describe('sm.StateQueryModel', function() {
	function desc(agenda) {
		for (var i = 0; i < agenda.length; i++) {
			agenda[i]();
		}
	}

	var lastState = '';

	var A = function(terms){ lastState += 'A'; };
	var B = function(terms){ lastState += 'B'; };
	var C = function(terms){ lastState += 'C'; };
	var D = function(terms){ lastState += 'D'; };
	var E = function(terms){ lastState += 'E'; };
	var F = function(terms){ lastState += 'F'; };
	var G = function(terms){ lastState += 'G'; };

	// store all rule terms in a single table (the binary search method at http://ejohn.org/blog/revised-javascript-dictionary-search/)
	var testData = { rules:[], conflictStrategy : desc };

	/* THIS IS HOW THE DATA LOOKS AFTER REDUCTION
	testData._terms[0] = [1,1.1,2.4];
	testData._terms[1] = 'd';
	testData._terms[3] = 'abcdefdog';
	testData._terms[4] = 'bluedefgefghhijktrue';
	testData._terms[5] = 'false';
	testData._terms[6] = 'yellow';
	testData._rules[0] = [[undefined,[0,1,1]],undefined,undefined,[[3,0,0]],[undefined,[4,1,0]],3,A];
	testData._rules[0] = [[undefined,[0,2,1]],undefined,undefined,[[3,0,0]],[undefined,[4,1,0]],3,B];
	testData._rules[0] = [[undefined,[0,2,1]],undefined,undefined,[[3,0,0]],[undefined,[4,2,0]],3,C];
	...
	*/

	testData.rules[0] = { terms : [ 'abc', 'defg', 1.1 ], operators : [0, 0, 'greaterThanOrEqual'], action : A };
	testData.rules[1] = { terms : [ 'abc', 'defg', 2.4 ], operators : [0, 0, 'greaterThanOrEqual'], action : B };
	testData.rules[2] = { terms : [ 'abc', 'efgh', 2.4 ], operators : [0, 0, 'greaterThanOrEqual'], action : C };
	testData.rules[3] = { terms : [ 'def', 'defg', 1 ], action : D };
	testData.rules[4] = { terms : [ 'hijk', 'd', 'yellow', 'dog', true ], action : E };
	testData.rules[5] = { terms : [ 'hijk', 'd', 'yellow', 'dog', false ], action : F };
	testData.rules[6] = { terms : [ 'hijk', 'd', 'blue', 'dog', false ], action : G };

	var target = null;

	beforeEach(function() {
		lastState = '';	
		if (target !== null) return;
		target = new smallmachine.type.StateQueryModel();
		target.addDataModel(testData);
	});

	it ('should find the identity of \'abc\'', function() {
		var actual = target.getTermId('abc');
		expect(actual[0]).toBe(3);
		expect(actual[1]).toBe(0);
	});

	it ('should find the identity of \'def\'', function() {
		var actual = target.getTermId('def');
		expect(actual[0]).toBe(3);
		expect(actual[1]).toBe(1);
	});

	it ('should find the identity of \'defg\'', function() {
		var actual = target.getTermId('defg');
		expect(actual[0]).toBe(4);
		expect(actual[1]).toBe(1);
	});

	it ('should find the identity of \'efgh\'', function() {
		var actual = target.getTermId('efgh');
		expect(actual[0]).toBe(4);
		expect(actual[1]).toBe(2);
	});

	it ('should find the identity of \'hijk\'', function() {
		var actual = target.getTermId('hijk');
		expect(actual[0]).toBe(4);
		expect(actual[1]).toBe(3);
	});

	it ('should find the identity of \'d\'', function() {
		var actual = target.getTermId('d');
		expect(actual[0]).toBe(1);
		expect(actual[1]).toBe(0);
	});

	it ('should find the identity of \'blue\'', function() {
		var actual = target.getTermId('blue');
		expect(actual[0]).toBe(4);
		expect(actual[1]).toBe(0);
	});

	it ('should find the identity of \'yellow\'', function() {
		var actual = target.getTermId('yellow');
		expect(actual[0]).toBe(6);
		expect(actual[1]).toBe(0);
	});

	it ('should find the identity of \'dog\'', function() {
		var actual = target.getTermId('dog');
		expect(actual[0]).toBe(3);
		expect(actual[1]).toBe(2);
	});

	it('should find the identity of boolean false', function() {
		var actual = target.getTermId(false);
		expect(actual[0]).toBe(5);
		expect(actual[1]).toBe(0);
	});

	it('should find the identity of boolean true', function() {
		var actual = target.getTermId(true);
		expect(actual[0]).toBe(4);
		expect(actual[1]).toBe(4);
	});

	it('should find the identity of int 1', function() {
		var actual = target.getTermId(1);
		expect(actual[0]).toBe(0);
		expect(actual[1]).toBe(0);
	});

	it('should find the identity of float 1.1', function() {
		var actual = target.getTermId(1.1);
		expect(actual[0]).toBe(0);
		expect(actual[1]).toBe(1);
	});

	it('should find the identity of float 2.4', function() {
		var actual = target.getTermId(2.4);
		expect(actual[0]).toBe(0);
		expect(actual[1]).toBe(2);
	});

	it('should indicate isEqualTermId = true when two term ID\'s are the same', function() {
		var foo = target.getTermId(2.4);
		var bar = target.getTermId(2.4);
		var actual = target.isEqualTermId(foo, bar);
		expect(actual).toBe(true);
	});

	it('should indicate isEqualTermId = false when two term ID\'s are not the same', function() {
		var foo = target.getTermId(2.4);
		var bar = target.getTermId(1.1);
		var actual = target.isEqualTermId(foo, bar);
		expect(actual).toBe(false);
	});

	it('should indicate isEqualTermId = false when one term ID\'s is false', function() {
		var foo = target.getTermId(2.4);
		var bar = false;
		var actual = target.isEqualTermId(foo, bar);
		expect(actual).toBe(false);
	});

	it('should include action A for state: \'abc\', \'defg\', 1.1', function() {
		var actual = target.executeQuery(['abc', 'defg', 1.1]);
		expect(lastState).toBe('A');
	});

	it('should include action B for state: \'abc\', \'defg\', 2.4', function() {
		var actual = target.executeQuery(['abc', 'defg', 2.4]);
		expect(lastState).toBe('B');
	});

	it('should include action C for state: \'abc\', \'efgh\', 2.4', function() {
		var actual = target.executeQuery(['abc', 'efgh', 2.4]);
		expect(lastState).toBe('C');
	});

	it('should include action D for state: \'def\', \'defg\', 1', function() {
		var actual = target.executeQuery(['def', 'defg', 1]);
		expect(lastState).toBe('D');
	});

	it('should include action E for state: \'hijk\', \'d\', \'yellow\', \'dog\', true', function() {
		var actual = target.executeQuery(['hijk', 'd', 'dog', 'yellow', true]);
		expect(lastState).toBe('E');
	});

	it('should include action F for state: \'hijk\', \'d\', \'yellow\', \'dog\', false', function() {
		var actual = target.executeQuery(['hijk', 'd', 'dog', 'yellow', false]);
		expect(lastState).toBe('F');
	});

	it('should include action G for state: \'hijk\', \'d\', \'blue\', \'dog\', false', function() {
		var actual = target.executeQuery(['hijk', 'd', 'dog', 'blue', false]);
		expect(lastState).toBe('G');
	});

	it('should include action A for state: \'abc\', \'defg\', 1.2', function() {
		var actual = target.executeQuery(['abc', 'defg', 1.2]);
		expect(lastState).toBe('A');
	});
});
