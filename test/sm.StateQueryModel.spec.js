describe('sm.StateQueryModel', function() {

	function desc(agenda) {
	}

	// for a given object, 'abc', with a given child of 'defg', at a given point in time >= 1.1s, fire an action A only
	// for a given object, 'abc', with a given child of 'defg', at a given point in time >= 2.4s, fire an action B only
	// for a given object, 'abc', with a given child of 'efgh', at a given point in time >= 2.4s, fire an action C only
	// for a given object, 'def', with a given child of 'defg', at a given point in time >= 1s, fire an action D only 
	// for a given object, 'hijk', with a given child of 'd', and a color 'yellow', and a pet 'dog', and a married 'true', fire an action E only 
	// for a given object, 'hijk', with a given child of 'd', and a color 'yellow', and a pet 'dog', and a married 'false', fire an action F only 
	// for a given object, 'hijk', with a given child of 'd', and a color 'blue', and a pet 'dog', and a married 'false', fire an action G only 

	var A = true;
	var B = true;
	var C = true;
	var D = true;
	var E = true;
	var F = true;
	var G = true;

	// store all rule words in a single table (the binary search method at http://ejohn.org/blog/revised-javascript-dictionary-search/)
	var testData = { words:[], rules:[], conflictStrategy : desc };
	testData.words[0] = [1,1.1,2.4];
	testData.words[1] = 'd';
	testData.words[3] = 'abcdefdog';
	testData.words[4] = 'bluedefgefghhijktrue';
	testData.words[5] = 'false';
	testData.words[6] = 'yellow';
	testData.rules[0] = { conditions : [ 'abc', 'defg', 1.1 ], actions : [ A ] };
	testData.rules[1] = { conditions : [ 'abc', 'defg', 2.4 ], actions : [ B ] };
	testData.rules[2] = { conditions : [ 'abc', 'efgh', 2.4 ], actions : [ C ] };
	testData.rules[3] = { conditions : [ 'def', 'defg', 1 ], actions : [ D ] };
	testData.rules[4] = { conditions : [ 'hijk', 'd', 'yellow', 'dog', true ], actions : [ E ] };
	testData.rules[5] = { conditions : [ 'hijk', 'd', 'yellow', 'dog', false ], actions : [ F ] };
	testData.rules[6] = { conditions : [ 'hijk', 'd', 'blue', 'dog', false ], actions : [ G ] };

	var target = null;

	beforeEach(function() {
		if (target !== null) return;
		target = new smallmachine.type.StateQueryModel();
		target.addDataModel(testData);
	});

	it ('should find the identity of \'abc\'', function() {
		var actual = target.getWordId('abc');
		expect(actual[0]).toBe(3);
		expect(actual[1]).toBe(0);
	});

	it ('should find the identity of \'def\'', function() {
		var actual = target.getWordId('def');
		expect(actual[0]).toBe(3);
		expect(actual[1]).toBe(1);
	});

	it ('should find the identity of \'defg\'', function() {
		var actual = target.getWordId('defg');
		expect(actual[0]).toBe(4);
		expect(actual[1]).toBe(1);
	});

	it ('should find the identity of \'defg\'', function() {
		var actual = target.getWordId('efgh');
		expect(actual[0]).toBe(4);
		expect(actual[1]).toBe(2);
	});

	it ('should find the identity of \'hijk\'', function() {
		var actual = target.getWordId('hijk');
		expect(actual[0]).toBe(4);
		expect(actual[1]).toBe(3);
	});

	it ('should find the identity of \'d\'', function() {
		var actual = target.getWordId('d');
		expect(actual[0]).toBe(1);
		expect(actual[1]).toBe(0);
	});

	it ('should find the identity of \'blue\'', function() {
		var actual = target.getWordId('blue');
		expect(actual[0]).toBe(4);
		expect(actual[1]).toBe(0);
	});

	it ('should find the identity of \'yellow\'', function() {
		var actual = target.getWordId('yellow');
		expect(actual[0]).toBe(6);
		expect(actual[1]).toBe(0);
	});

	it ('should find the identity of \'dog\'', function() {
		var actual = target.getWordId('dog');
		expect(actual[0]).toBe(3);
		expect(actual[1]).toBe(2);
	});

	it('should find the identity of boolean false', function() {
		var actual = target.getWordId(false);
		expect(actual[0]).toBe(5);
		expect(actual[1]).toBe(0);
	});

	it('should find the identity of boolean true', function() {
		var actual = target.getWordId(true);
		expect(actual[0]).toBe(4);
		expect(actual[1]).toBe(4);
	});

	it('should find the identity of int 1', function() {
		var actual = target.getWordId(1);
		expect(actual[0]).toBe(0);
		expect(actual[1]).toBe(0);
	});

	it('should find the identity of float 1.1', function() {
		var actual = target.getWordId(1.1);
		expect(actual[0]).toBe(0);
		expect(actual[1]).toBe(1);
	});

	it('should find the identity of float 2.4', function() {
		var actual = target.getWordId(2.4);
		expect(actual[0]).toBe(0);
		expect(actual[1]).toBe(2);
	});

	it('should indicate isEqualWordId = true when two word ID\'s are the same', function() {
		var foo = target.getWordId(2.4);
		var bar = target.getWordId(2.4);
		var actual = target.isEqualWordId(foo, bar);
		expect(actual).toBe(true);
	});

	it('should indicate isEqualWordId = false when two word ID\'s are not the same', function() {
		var foo = target.getWordId(2.4);
		var bar = target.getWordId(1.1);
		var actual = target.isEqualWordId(foo, bar);
		expect(actual).toBe(false);
	});

	it('should indicate isEqualWordId = false when one word ID\'s is false', function() {
		var foo = target.getWordId(2.4);
		var bar = false;
		var actual = target.isEqualWordId(foo, bar);
		expect(actual).toBe(false);
	});
});
