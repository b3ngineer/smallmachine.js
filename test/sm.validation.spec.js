describe('sm.validation', function() {
	var testRules = new smallmachine.Ontology('sm.test.rules'); 

	testRules.addTerm('something');
	testRules.addTerm('type1');
	testRules.addTerm('type2');
	testRules.addTerm('type3');
	testRules.type1.isA(testRules.something);
	testRules.type2.isA(testRules.something);
	testRules.type3.isA(testRules.something);

	var rulesTarget = new smallmachine([testRules],[smallmachine.behavior.Validation]); 
	rulesTarget.something.type1.max(1);
	
	it('should allow the creation of object models that throw an error if properties exceed maximum', function() {
		rulesTarget.something.type1.add('a', true);
		expect(function() { rulesTarget.something.type1.add('b', true); }).toThrow(new Error('The maximum number of items already exists in this collection (max 1)'));
	});
});
