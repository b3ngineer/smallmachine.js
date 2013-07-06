describe('sm.core', function() {

	it('should create the add method on the core', function() {
		expect(sm.add).toBeDefined();
	});

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

	describe('range and domain of waitsFor queries', function() {
		it('should allow accessing of the messenger.waitsFor channel', function() {
			expect(sm.messenger.waitsFor).toBeDefined();
		});

		it('should allow accessing of the messenger.waitsFor.task channel', function() {
			expect(sm.messenger.waitsFor.task).toBeDefined();
		});

		it('should allow accessing of the messenger.waitsFor.task.get channel', function() {
			expect(sm.messenger.waitsFor.task.get).toBeDefined();
		});

		it('should allow accessing of the messenger.waitsFor.task.set channel', function() {
			expect(sm.messenger.waitsFor.task.set).toBeDefined();
		});

		it('should allow accessing of the messenger.waitsFor.get channel', function() {
			expect(sm.messenger.waitsFor.get).toBeDefined();
		});

		it('should allow accessing of the messenger.waitsFor.set channel', function() {
			expect(sm.messenger.waitsFor.set).toBeDefined();
		});

		it('should allow accessing of the waitsFor channel', function() {
			expect(sm.waitsFor).toBeDefined();
		});

		it('should allow accessing of the waitsFor.task channel', function() {
			expect(sm.waitsFor.task).toBeDefined();
		});

		it('should allow accessing of the waitsFor.task.get channel', function() {
			expect(sm.waitsFor.task.get).toBeDefined();
		});

		it('should allow accessing of the waitsFor.task.set channel', function() {
			expect(sm.waitsFor.task.set).toBeDefined();
		});

		it('should allow accessing of the waitsFor.get channel', function() {
			expect(sm.waitsFor.get).toBeDefined();
		});

		it('should allow accessing of the waitsFor.set channel', function() {
			expect(sm.waitsFor.set).toBeDefined();
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

	describe('pub/sub', function() {
		it('should implement the subscribe method on a channel object', function() {
			expect(sm.thing.subscribe).toBeDefined();
		});

		it('should implement the publish method on a channel object', function() {
			expect(sm.thing.publish).toBeDefined();
		});
		
		it('should use lazy instantiation of the suscriber collection on an inheriting prototype', function() {
			expect(sm.thing._subscribers).not.toBeDefined();
			sm.thing.subscribe({
				update :function(result) {
				},
				cancel : function(result) {
				}
			});
			expect(sm.thing._subscribers).toBeDefined();
		});

		it('should add a subscriber to the user channel\'s internal collection', function() {
			sm.thing.user.subscribe({
				update :function(result) { 
				},
				cancel : function(result) {
				}
			});

			expect(sm.thing.user._subscribers.length).toBe(1);
			expect(sm.user._subscribers.length).toBe(1);
			delete sm.thing.user._subscribers;
		});

		it('should notify subscribers on action and action subclasses during a publish on user', function() {
			var notified = 0;

			sm.action.subscribe({
				update : function(result) {
					notified++;
				},
				cancel : function(result) {
				}
			});

			sm.click.subscribe({
				update : function(result) {
					notified++;
				},
				cancel : function(result) {
				}
			});

			sm.doubleClick.subscribe({
				update : function(result) {
					notified++;
				},
				cancel : function(result) {
				}
			});

			sm.keyPress.subscribe({
				update : function(result) {
					notified++;
				},
				cancel : function(result) {
				}
			});

			sm.user.publish({}); // publish to all vertices under user
			expect(notified).toBe(4);
			delete sm.performs.action._subscribers;
			delete sm.performs.action.click._subscribers;
			delete sm.performs.action.doubleClick._subscribers;
			delete sm.performs.action.keyPress._subscribers;
		});

		it('should notify subscribers with results of scalar types', function() {
            var notified = null;

			sm.keyPress.subscribe({
				update : function(result) {
                    notified = result;
				},
				cancel : function(result) {
				}
			});

            sm.keyPress.publish('test');
            expect(notified).toBe('test');
			delete sm.performs.action.keyPress._subscribers;
        });

		it('should notify subscribers with results of object types', function() {
            var notified = null;

			sm.keyPress.subscribe({
				update : function(result) {
                    notified = result;
				},
				cancel : function(result) {
				}
			});

            sm.keyPress.publish({ test : 123 });
            expect(notified.test).toBe(123);
			delete sm.performs.action.keyPress._subscribers;
        });

		it('should notify subscribers with results generated by passed in functions', function() {
            var notified = null;

			sm.keyPress.subscribe({
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
	});
});

