describe('sm.ontology', function() {
	describe('explicit queries', function() {

		it('should allow accessing of the thing channel', function() {
			expect(sm.thing).toBeDefined();
		});

		it('should allow accessing of the thing.user channel', function() {
			expect(sm.thing.user).toBeDefined();
		});

		it('should allow accessing of the thing.system channel', function() {
			expect(sm.thing.system).toBeDefined();
		});

		it('should allow accessing of the thing.action channel', function() {
			expect(sm.thing.action).toBeDefined();
		});

		it('should allow accessing of the thing.task channel', function() {
			expect(sm.thing.task).toBeDefined();
		});

		it('should allow accessing of the thing.messenger channel', function() {
			expect(sm.thing.messenger).toBeDefined();
		});

		it('should allow accessing of the thing.action.click channel', function() {
			expect(sm.thing.action.click).toBeDefined();
		});

		it('should allow accessing of the thing.action.doubleClick channel', function() {
			expect(sm.thing.action.doubleClick).toBeDefined();
		});

		it('should allow accessing of the thing.action.keyPress channel', function() {
			expect(sm.thing.action.keyPress).toBeDefined();
		});

		it('should allow accessing of the thing.task.get channel', function() {
			expect(sm.thing.task.get).toBeDefined();
		});

		it('should allow accessing of the thing.task.set channel', function() {
			expect(sm.thing.task.set).toBeDefined();
		});

		it('should allow accessing of the thing.messenger.success channel', function() {
			expect(sm.thing.messenger.success).toBeDefined();
		});

		it('should allow accessing of the thing.messenger.error channel', function() {
			expect(sm.thing.messenger.error).toBeDefined();
		});
	});

	describe('subclasses of thing queries', function() {
		it('should allow accessing of the user channel', function() {
			expect(sm.user).toBeDefined();
		});

		it('should allow accessing of the system channel', function() {
			expect(sm.system).toBeDefined();
		});

		it('should allow accessing of the action channel', function() {
			expect(sm.action).toBeDefined();
		});

		it('should allow accessing of the task channel', function() {
			expect(sm.task).toBeDefined();
		});

		it('should allow accessing of the messenger channel', function() {
			expect(sm.messenger).toBeDefined();
		});
	});

	describe('subclasses of action queries', function() {
		it('should allow accessing of the action.click channel', function() {
			expect(sm.action.click).toBeDefined();
		});

		it('should allow accessing of the action.doubleClick channel', function() {
			expect(sm.action.doubleClick).toBeDefined();
		});

		it('should allow accessing of the action.keyPress channel', function() {
			expect(sm.action.keyPress).toBeDefined();
		});
	});

	describe('subclasses of task queries', function() {
		it('should allow accessing of the task.get channel', function() {
			expect(sm.task.get).toBeDefined();
		});

		it('should allow accessing of the task.set channel', function() {
			expect(sm.task.set).toBeDefined();
		});
	});

	describe('subclasses of messenger queries', function() {
		it('should allow accessing of the messenger.success channel', function() {
			expect(sm.messenger.success).toBeDefined();
		});

		it('should allow accessing of the messenger.error channel', function() {
			expect(sm.messenger.error).toBeDefined();
		});
	});

	describe('range of performs queries', function() {
		it('should allow accessing of the performs channel', function() {
			expect(sm.performs).toBeDefined();
		});

		it('should allow accessing of the performs.action channel', function() {
			expect(sm.performs.action).toBeDefined();
		});

		it('should allow accessing of the performs.task channel', function() {
			expect(sm.performs.task).toBeDefined();
		});

		it('should allow accessing of the performs.action.click channel', function() {
			expect(sm.performs.action.click).toBeDefined();
		});

		it('should allow accessing of the performs.click channel', function() {
			expect(sm.performs.click).toBeDefined();
		});

		it('should allow accessing of the performs.action.doubleClick channel', function() {
			expect(sm.performs.action.doubleClick).toBeDefined();
		});

		it('should allow accessing of the performs.doubleClick channel', function() {
			expect(sm.performs.doubleClick).toBeDefined();
		});

		it('should allow accessing of the performs.action.keyPress channel', function() {
			expect(sm.performs.action.keyPress).toBeDefined();
		});

		it('should allow accessing of the performs.keyPress channel', function() {
			expect(sm.performs.keyPress).toBeDefined();
		});

		it('should allow accessing of the performs.task.get channel', function() {
			expect(sm.performs.task.get).toBeDefined();
		});

		it('should allow accessing of the performs.get channel', function() {
			expect(sm.performs.get).toBeDefined();
		});

		it('should allow accessing of the performs.task.set channel', function() {
			expect(sm.performs.task.set).toBeDefined();
		});

		it('should allow accessing of the performs.set channel', function() {
			expect(sm.performs.set).toBeDefined();
		});

		it('should allow accessing of the user.performs channel', function() {
			expect(sm.user.performs).toBeDefined();
		});

		it('should allow accessing of the user.performs.action channel', function() {
			expect(sm.user.performs.action).toBeDefined();
		});

		it('should allow accessing of the user.performs.action.click channel', function() {
			expect(sm.user.performs.action.click).toBeDefined();
		});

		it('should allow accessing of the user.performs.action.doubleClick channel', function() {
			expect(sm.user.performs.action.doubleClick).toBeDefined();
		});

		it('should allow accessing of the user.performs.action.keyPress channel', function() {
			expect(sm.user.performs.action.keyPress).toBeDefined();
		});

		it('should allow accessing of the user.performs.click channel', function() {
			expect(sm.user.performs.click).toBeDefined();
		});

		it('should allow accessing of the user.performs.doubleClick channel', function() {
			expect(sm.user.performs.doubleClick).toBeDefined();
		});

		it('should allow accessing of the user.performs.keyPress channel', function() {
			expect(sm.user.performs.keyPress).toBeDefined();
		});

		it('should allow accessing of the system.performs channel', function() {
			expect(sm.system.performs).toBeDefined();
		});

		it('should allow accessing of the system.performs.task channel', function() {
			expect(sm.system.performs.task).toBeDefined();
		});

		it('should allow accessing of the system.performs.task.get channel', function() {
			expect(sm.system.performs.task.get).toBeDefined();
		});

		it('should allow accessing of the system.performs.task.set channel', function() {
			expect(sm.system.performs.task.set).toBeDefined();
		});

		it('should allow accessing of the system.performs.get channel', function() {
			expect(sm.system.performs.get).toBeDefined();
		});

		it('should allow accessing of the system.performs.set channel', function() {
			expect(sm.system.performs.set).toBeDefined();
		});
	});

	describe('range and domain of reactsTo queries', function() {
		it('should allow accessing of the system.reactsTo channel', function() {
			expect(sm.system.reactsTo).toBeDefined();
		});

		it('should allow accessing of the system.reactsTo.action channel', function() {
			expect(sm.system.reactsTo.action).toBeDefined();
		});

		it('should allow accessing of the system.reactsTo.action.click channel', function() {
			expect(sm.system.reactsTo.action.click).toBeDefined();
		});

		it('should allow accessing of the system.reactsTo.action.doublClick channel', function() {
			expect(sm.system.reactsTo.action.doubleClick).toBeDefined();
		});

		it('should allow accessing of the system.reactsTo.action.keyPress channel', function() {
			expect(sm.system.reactsTo.action.keyPress).toBeDefined();
		});

		it('should allow accessing of the system.reactsTo.click channel', function() {
			expect(sm.system.reactsTo.click).toBeDefined();
		});

		it('should allow accessing of the system.reactsTo.doublClick channel', function() {
			expect(sm.system.reactsTo.doubleClick).toBeDefined();
		});

		it('should allow accessing of the system.reactsTo.keyPress channel', function() {
			expect(sm.system.reactsTo.keyPress).toBeDefined();
		});

		it('should allow accessing of the reactsTo channel', function() {
			expect(sm.reactsTo).toBeDefined();
		});

		it('should allow accessing of the reactsTo.action channel', function() {
			expect(sm.reactsTo.action).toBeDefined();
		});

		it('should allow accessing of the reactsTo.action.click channel', function() {
			expect(sm.reactsTo.action.click).toBeDefined();
		});

		it('should allow accessing of the reactsTo.action.doubleClick channel', function() {
			expect(sm.reactsTo.action.doubleClick).toBeDefined();
		});

		it('should allow accessing of the reactsTo.action.keyPress channel', function() {
			expect(sm.reactsTo.action.keyPress).toBeDefined();
		});

		it('should allow accessing of the reactsTo.click channel', function() {
			expect(sm.reactsTo.click).toBeDefined();
		});

		it('should allow accessing of the reactsTo.doubleClick channel', function() {
			expect(sm.reactsTo.doubleClick).toBeDefined();
		});

		it('should allow accessing of the reactsTo.keyPress channel', function() {
			expect(sm.reactsTo.keyPress).toBeDefined();
		});
	});

    describe('publishing to relationships', function() {
        it('should notify subscribers to user.perform when any action is published to', function() {
            var notified = null;

            sm.user.performs.subscribe({
                update : function(result) {
                    notified = result;
                },
                cancel : function(result) {
                }
            });
            
            sm.keyPress.publish(function(){ return 123; });
            expect(notified).toBe(123);
			delete sm.performs.action.keyPress._subscribers;
        });

        it('should notify subscribers to system.reactsTo when any action is published to', function() {
            var notified = null;

            sm.system.reactsTo.subscribe({
                update : function(result) {
                    notified = result;
                },
                cancel : function(result) {
                }
            });
            
            sm.keyPress.publish(function(){ return 123; });
            expect(notified).toBe(123);
			delete sm.performs.action.keyPress._subscribers;
        });

        it('should notify subscribers to sm.performs when any action or task is published to', function() {
            var notified = 0;
            sm.performs.subscribe({ update : function(result) { notified++; }, cancel : function(result) { } });
            sm.user.keyPress.publish(function(){ return 123; });
            sm.system.get.publish(function(){ return 123; });
            expect(notified).toBe(2);
			delete sm.performs.action.click._subscribers;
        });
    });

	describe('invalid queries', function() {
		it('should not allow accessing of the user.reactsTo channel', function() {
			expect(sm.user.reactsTo).not.toBeDefined();
		});

		it('should not allow accessing of the user.performs.get channel', function() {
			expect(sm.user.performs.get).not.toBeDefined();
		});

		it('should not allow accessing of the user.performs.set channel', function() {
			expect(sm.user.performs.set).not.toBeDefined();
		});

		it('should not allow accessing of the user.waitsFor channel', function() {
			expect(sm.user.waitsFor).not.toBeDefined();
		});

		it('should not allow accessing of the system.waitsFor channel', function() {
			expect(sm.system.waitsFor).not.toBeDefined();
		});

		it('should not allow accessing of the messenger.performs channel', function() {
			expect(sm.messenger.performs).not.toBeDefined();
		});
	});

    describe('inferring _type:', function() {
		it('hasRange() should set user.performs._type to sm.RELATIONSHIP type', function() {
			expect(sm.user.performs._type).toBe(sm.RELATIONSHIP);
		});

		it('hasRange() should set system.reactsTo._type to sm.RELATIONSHIP type', function() {
			expect(sm.system.reactsTo._type).toBe(sm.RELATIONSHIP);
		});
    });
});
