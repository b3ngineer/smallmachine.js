describe('sm.core', function() {

	it('should create the add method on the core', function() {
		expect(sm.add).toBeDefined();
	});

	describe('methods', function() {
		it('should add message types to the sm.type namespace', function() {
			sm.addMessageType('Test1', function() { return this; });
			expect(sm.types.Test1).toBeDefined();
			delete sm.types.Test1;
		});

		it('should copy prototype functions when adding a message type', function() {
			var Test2 = function() {
				return this;
			};
			Test2.prototype.test = function() {
				return true;
			};
			sm.addMessageType('Test2', Test2);
			expect(typeof sm.types.Test2.prototype.test).toBe('function');
			delete sm.types.Test2;
		});

		it('should create member functions on message type instances', function() {
			var Test3 = function() {
				return this;
			};
			Test3.prototype.test = function() {
				return true;
			};
			sm.addMessageType('Test3', Test3);
			var testType = new sm.types.Test3();
			expect(testType.test()).toBe(true);
			delete sm.types.Test3;
		});

		it('should allow the use of instanceof to test an instance\'s type', function() {
			var Test4 = function() {
				return this;
			};
			sm.addMessageType('Test4', Test4);
			var testType = new sm.types.Test4();
			expect(testType instanceof sm.types.Test4).toBe(true);
			delete sm.types.Test4;
		});

		it('should merge prototype methods of two message types when added with the same name', function() {
			var TestA = function() {
				this.propertyA = true;
				return this;
			};

			TestA.prototype.methodA = function() {
				return true;
			};

			var TestB = function() {
				this.propertyB = true;
				return this;
			};

			TestB.prototype.methodB = function() {
				return true;
			};

			sm.addMessageType('Test', TestA);
			sm.addMessageType('Test', TestB);
			expect(sm.types.Test.prototype.methodA).toBeDefined();
			expect(sm.types.Test.prototype.methodB).toBeDefined();
			delete sm.types.Test;
		});

		it('should allow truthful comparison of types after merge', function() {
			var TestA = function() {
				this.propertyA = true;
				return this;
			};

			var TestB = function() {
				return this;
			};

			sm.addMessageType('Test', TestA);
			sm.addMessageType('Test', TestB);
			var test = new sm.types.Test();
			expect(test.ofType('Test')).toBe(true);
			expect(test.getType()).toBe('[object Test]');
			expect(test instanceof sm.types.Test).toBe(true);
			delete sm.types.Test;
		});

        it('should allow comparing instanceof AsyncResult from modules outside of core', function() {
            var test = new sm.types.AsyncResult();
            expect(test instanceof sm.types.AsyncResult).toBe(true);
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
			sm.keyPress.subscribe({update:function(result){notified=result;},cancel:function(result){}});
			sm.keyPress.publish(function(){return 123;});
			expect(notified).toBe(123);
			delete sm.keyPress._subscribers;
		});
	});
});

