describe('sm.ontology', function() {

	var ontologyA = new smallmachine.Ontology('sm.testA');
	ontologyA.registerActivator(function(model) {
		if (typeof model.activatorOrder === 'undefined') {
			model.activatorOrder = [];
		}
		model.activatorOrder.push('sm.testA');
	});
	smallmachine.ontology.extendedBy(ontologyA);

	var ontologyB = new smallmachine.Ontology('sm.testB');
	ontologyB.registerActivator(function(model) {
		if (typeof model.activatorOrder === 'undefined') {
			model.activatorOrder = [];
		}
		model.activatorOrder.push('sm.testB');
	}, ['sm.testA']);
	smallmachine.ontology.extendedBy(ontologyB);

	var ontologyC = new smallmachine.Ontology('sm.testC');
	ontologyC.registerActivator(function(model) {
		if (typeof model.activatorOrder === 'undefined') {
			model.activatorOrder = [];
		}
		model.activatorOrder.push('sm.testC');
	}, ['sm.testA', 'sm.testB']);
	smallmachine.ontology.extendedBy(ontologyC);

	describe('merging', function() {
		it('should reorder 2 activators when one has a dependency on the other', function() {
			var actual = smallmachine(['sm.testB', 'sm.testA']);
			expect(actual.activatorOrder[0]).toBe('sm.testA');
		});

		it('should reorder 3 activators when one has a dependency on the other 2', function() {
			var actual = smallmachine(['sm.testC', 'sm.testB', 'sm.testA']);
			expect(actual.activatorOrder[0]).toBe('sm.testA');
			expect(actual.activatorOrder[1]).toBe('sm.testB');
			expect(actual.activatorOrder[2]).toBe('sm.testC');
		});

		it('should throw an error if an activator is dependent on an ontology that has not been included', function() {
			expect(function(){
				var actual = smallmachine(['sm.testB']);
			}).toThrow(new Error("Cannot wire-in ontology with missing activator dependency on 'sm.testA'"));
		});
	});
});
