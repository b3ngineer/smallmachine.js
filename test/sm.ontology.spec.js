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

	describe('explicit queries', function() {

		it('should allow accessing of the thing channel', function() {
			expect(target.thing).toBeDefined();
		});

		it('should allow accessing of the thing.user channel', function() {
			expect(target.thing.user).toBeDefined();
		});

		it('should allow accessing of the thing.system channel', function() {
			expect(target.thing.system).toBeDefined();
		});

		it('should allow accessing of the thing.action channel', function() {
			expect(target.thing.action).toBeDefined();
		});

		it('should allow accessing of the thing.task channel', function() {
			expect(target.thing.task).toBeDefined();
		});

		it('should allow accessing of the thing.messenger channel', function() {
			expect(target.thing.messenger).toBeDefined();
		});

		it('should allow accessing of the thing.action.click channel', function() {
			expect(target.thing.action.click).toBeDefined();
		});

		it('should allow accessing of the thing.action.doubleClick channel', function() {
			expect(target.thing.action.doubleClick).toBeDefined();
		});

		it('should allow accessing of the thing.action.keyPress channel', function() {
			expect(target.thing.action.keyPress).toBeDefined();
		});

		it('should allow accessing of the thing.task.get channel', function() {
			expect(target.thing.task.get).toBeDefined();
		});

		it('should allow accessing of the thing.task.set channel', function() {
			expect(target.thing.task.set).toBeDefined();
		});

		it('should allow accessing of the thing.messenger.success channel', function() {
			expect(target.thing.messenger.success).toBeDefined();
		});

		it('should allow accessing of the thing.messenger.error channel', function() {
			expect(target.thing.messenger.error).toBeDefined();
		});
	});

	describe('subclasses of thing queries', function() {
		it('should allow accessing of the user channel', function() {
			expect(target.user).toBeDefined();
		});

		it('should allow accessing of the system channel', function() {
			expect(target.system).toBeDefined();
		});

		it('should allow accessing of the action channel', function() {
			expect(target.action).toBeDefined();
		});

		it('should allow accessing of the task channel', function() {
			expect(target.task).toBeDefined();
		});

		it('should allow accessing of the messenger channel', function() {
			expect(target.messenger).toBeDefined();
		});
	});

	describe('subclasses of action queries', function() {
		it('should allow accessing of the action.click channel', function() {
			expect(target.action.click).toBeDefined();
		});

		it('should allow accessing of the action.doubleClick channel', function() {
			expect(target.action.doubleClick).toBeDefined();
		});

		it('should allow accessing of the action.keyPress channel', function() {
			expect(target.action.keyPress).toBeDefined();
		});
	});

	describe('subclasses of task queries', function() {
		it('should allow accessing of the task.get channel', function() {
			expect(target.task.get).toBeDefined();
		});

		it('should allow accessing of the task.set channel', function() {
			expect(target.task.set).toBeDefined();
		});
	});

	describe('subclasses of messenger queries', function() {
		it('should allow accessing of the messenger.success channel', function() {
			expect(target.messenger.success).toBeDefined();
		});

		it('should allow accessing of the messenger.error channel', function() {
			expect(target.messenger.error).toBeDefined();
		});
	});

	describe('range of performs queries', function() {
		it('should allow accessing of the performs channel', function() {
			expect(target.performs).toBeDefined();
		});

		it('should allow accessing of the performs.action channel', function() {
			expect(target.performs.action).toBeDefined();
		});

		it('should allow accessing of the performs.task channel', function() {
			expect(target.performs.task).toBeDefined();
		});

		it('should allow accessing of the performs.action.click channel', function() {
			expect(target.performs.action.click).toBeDefined();
		});

		it('should allow accessing of the performs.click channel', function() {
			expect(target.performs.click).toBeDefined();
		});

		it('should allow accessing of the performs.action.doubleClick channel', function() {
			expect(target.performs.action.doubleClick).toBeDefined();
		});

		it('should allow accessing of the performs.doubleClick channel', function() {
			expect(target.performs.doubleClick).toBeDefined();
		});

		it('should allow accessing of the performs.action.keyPress channel', function() {
			expect(target.performs.action.keyPress).toBeDefined();
		});

		it('should allow accessing of the performs.keyPress channel', function() {
			expect(target.performs.keyPress).toBeDefined();
		});

		it('should allow accessing of the performs.task.get channel', function() {
			expect(target.performs.task.get).toBeDefined();
		});

		it('should allow accessing of the performs.get channel', function() {
			expect(target.performs.get).toBeDefined();
		});

		it('should allow accessing of the performs.task.set channel', function() {
			expect(target.performs.task.set).toBeDefined();
		});

		it('should allow accessing of the performs.set channel', function() {
			expect(target.performs.set).toBeDefined();
		});

		it('should allow accessing of the user.performs channel', function() {
			expect(target.user.performs).toBeDefined();
		});

		it('should allow accessing of the user.performs.action channel', function() {
			expect(target.user.performs.action).toBeDefined();
		});

		it('should allow accessing of the user.performs.action.click channel', function() {
			expect(target.user.performs.action.click).toBeDefined();
		});

		it('should allow accessing of the user.performs.action.doubleClick channel', function() {
			expect(target.user.performs.action.doubleClick).toBeDefined();
		});

		it('should allow accessing of the user.performs.action.keyPress channel', function() {
			expect(target.user.performs.action.keyPress).toBeDefined();
		});

		it('should allow accessing of the user.performs.click channel', function() {
			expect(target.user.performs.click).toBeDefined();
		});

		it('should allow accessing of the user.performs.doubleClick channel', function() {
			expect(target.user.performs.doubleClick).toBeDefined();
		});

		it('should allow accessing of the user.performs.keyPress channel', function() {
			expect(target.user.performs.keyPress).toBeDefined();
		});

		it('should allow accessing of the system.performs channel', function() {
			expect(target.system.performs).toBeDefined();
		});

		it('should allow accessing of the system.performs.task channel', function() {
			expect(target.system.performs.task).toBeDefined();
		});

		it('should allow accessing of the system.performs.task.get channel', function() {
			expect(target.system.performs.task.get).toBeDefined();
		});

		it('should allow accessing of the system.performs.task.set channel', function() {
			expect(target.system.performs.task.set).toBeDefined();
		});

		it('should allow accessing of the system.performs.get channel', function() {
			expect(target.system.performs.get).toBeDefined();
		});

		it('should allow accessing of the system.performs.set channel', function() {
			expect(target.system.performs.set).toBeDefined();
		});
	});

	describe('range and domain of reactsTo queries', function() {
		it('should allow accessing of the system.reactsTo channel', function() {
			expect(target.system.reactsTo).toBeDefined();
		});

		it('should allow accessing of the system.reactsTo.action channel', function() {
			expect(target.system.reactsTo.action).toBeDefined();
		});

		it('should allow accessing of the system.reactsTo.action.click channel', function() {
			expect(target.system.reactsTo.action.click).toBeDefined();
		});

		it('should allow accessing of the system.reactsTo.action.doublClick channel', function() {
			expect(target.system.reactsTo.action.doubleClick).toBeDefined();
		});

		it('should allow accessing of the system.reactsTo.action.keyPress channel', function() {
			expect(target.system.reactsTo.action.keyPress).toBeDefined();
		});

		it('should allow accessing of the system.reactsTo.click channel', function() {
			expect(target.system.reactsTo.click).toBeDefined();
		});

		it('should allow accessing of the system.reactsTo.doublClick channel', function() {
			expect(target.system.reactsTo.doubleClick).toBeDefined();
		});

		it('should allow accessing of the system.reactsTo.keyPress channel', function() {
			expect(target.system.reactsTo.keyPress).toBeDefined();
		});

		it('should allow accessing of the reactsTo channel', function() {
			expect(target.reactsTo).toBeDefined();
		});

		it('should allow accessing of the reactsTo.action channel', function() {
			expect(target.reactsTo.action).toBeDefined();
		});

		it('should allow accessing of the reactsTo.action.click channel', function() {
			expect(target.reactsTo.action.click).toBeDefined();
		});

		it('should allow accessing of the reactsTo.action.doubleClick channel', function() {
			expect(target.reactsTo.action.doubleClick).toBeDefined();
		});

		it('should allow accessing of the reactsTo.action.keyPress channel', function() {
			expect(target.reactsTo.action.keyPress).toBeDefined();
		});

		it('should allow accessing of the reactsTo.click channel', function() {
			expect(target.reactsTo.click).toBeDefined();
		});

		it('should allow accessing of the reactsTo.doubleClick channel', function() {
			expect(target.reactsTo.doubleClick).toBeDefined();
		});

		it('should allow accessing of the reactsTo.keyPress channel', function() {
			expect(target.reactsTo.keyPress).toBeDefined();
		});
	});

	describe('invalid queries', function() {
		it('should not allow accessing of the user.reactsTo channel', function() {
			expect(target.user.reactsTo).not.toBeDefined();
		});

		it('should not allow accessing of the user.performs.get channel', function() {
			expect(target.user.performs.get).not.toBeDefined();
		});

		it('should not allow accessing of the user.performs.set channel', function() {
			expect(target.user.performs.set).not.toBeDefined();
		});

		it('should not allow accessing of the user.waitsFor channel', function() {
			expect(target.user.waitsFor).not.toBeDefined();
		});

		it('should not allow accessing of the system.waitsFor channel', function() {
			expect(target.system.waitsFor).not.toBeDefined();
		});

		it('should not allow accessing of the messenger.performs channel', function() {
			expect(target.messenger.performs).not.toBeDefined();
		});
	});

    describe('inferring _type:', function() {
		it('hasRange() should set user.performs._type to target.RELATIONSHIP type', function() {
			expect(target.user.performs._type).toBe(smallmachine.RELATIONSHIP);
		});

		it('hasRange() should set system.reactsTo._type to target.RELATIONSHIP type', function() {
			expect(target.system.reactsTo._type).toBe(smallmachine.RELATIONSHIP);
		});
    });

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
