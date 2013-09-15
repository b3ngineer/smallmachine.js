describe('target.core', function() {

	it('should create the add method on the core', function() {
		expect(target.add).toBeDefined();
	});

	describe('methods', function() {
		it('should add message types to the target.type namespace', function() {
			smallmachine.addMessageType('Test1', function() { return this; });
			expect(smallmachine.types.Test1).toBeDefined();
			delete smallmachine.types.Test1;
		});

		it('should copy prototype functions when adding a message type', function() {
			var Test2 = function() {
				return this;
			};
			Test2.prototype.test = function() {
				return true;
			};
			smallmachine.addMessageType('Test2', Test2);
			expect(typeof smallmachine.types.Test2.prototype.test).toBe('function');
			delete smallmachine.types.Test2;
		});

		it('should create member functions on message type instances', function() {
			var Test3 = function() {
				return this;
			};
			Test3.prototype.test = function() {
				return true;
			};
			smallmachine.addMessageType('Test3', Test3);
			var testType = new smallmachine.types.Test3();
			expect(testType.test()).toBe(true);
			delete smallmachine.types.Test3;
		});

		it('should allow the use of instanceof to test an instance\'s type', function() {
			var Test4 = function() {
				return this;
			};
			smallmachine.addMessageType('Test4', Test4);
			var testType = new smallmachine.types.Test4();
			expect(testType instanceof smallmachine.types.Test4).toBe(true);
			delete smallmachine.types.Test4;
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

			smallmachine.addMessageType('Test', TestA);
			smallmachine.addMessageType('Test', TestB);
			expect(smallmachine.types.Test.prototype.methodA).toBeDefined();
			expect(smallmachine.types.Test.prototype.methodB).toBeDefined();
			delete smallmachine.types.Test;
		});

		it('should allow truthful comparison of types after merge', function() {
			var TestA = function() {
				this.propertyA = true;
				return this;
			};

			var TestB = function() {
				return this;
			};

			smallmachine.addMessageType('Test', TestA);
			smallmachine.addMessageType('Test', TestB);
			var test = new smallmachine.types.Test();
			expect(test.ofType('Test')).toBe(true);
			expect(test.getType()).toBe('[object Test]');
			expect(test instanceof smallmachine.types.Test).toBe(true);
			delete smallmachine.types.Test;
		});

        it('should allow comparing instanceof AsyncResult from modules outside of core', function() {
            var test = new smallmachine.types.AsyncResult();
            expect(test instanceof smallmachine.types.AsyncResult).toBe(true);
        });
	});

	describe('pub/sub', function() {
		it('should implement the subscribe method on a channel object', function() {
			expect(target.thing.subscribe).toBeDefined();
		});

		it('should implement the publish method on a channel object', function() {
			expect(target.thing.publish).toBeDefined();
		});
		
		it('should use lazy instantiation of the suscriber collection on an inheriting prototype', function() {
			expect(target.thing._subscribers).not.toBeDefined();
			target.thing.subscribe({
				update :function(result) {
				},
				cancel : function(result) {
				}
			});
			expect(target.thing._subscribers).toBeDefined();
		});

		it('should add a subscriber to the user channel\'s internal collection', function() {
			target.thing.user.subscribe({
				update :function(result) { 
				},
				cancel : function(result) {
				}
			});

			expect(target.thing.user._subscribers.length).toBe(1);
			expect(target.user._subscribers.length).toBe(1);
			delete target.thing.user._subscribers;
		});

		it('should notify subscribers on action and action subclasses during a publish on user', function() {
			var notified = 0;

			target.action.subscribe({
				update : function(result) {
					notified++;
				},
				cancel : function(result) {
				}
			});

			target.click.subscribe({
				update : function(result) {
					notified++;
				},
				cancel : function(result) {
				}
			});

			target.doubleClick.subscribe({
				update : function(result) {
					notified++;
				},
				cancel : function(result) {
				}
			});

			target.keyPress.subscribe({
				update : function(result) {
					notified++;
				},
				cancel : function(result) {
				}
			});

			target.user.publish({}); // publish to all vertices under user
			expect(notified).toBe(4);
			delete target.performs.action._subscribers;
			delete target.performs.action.click._subscribers;
			delete target.performs.action.doubleClick._subscribers;
			delete target.performs.action.keyPress._subscribers;
		});

		it('should notify subscribers with results of scalar types', function() {
			var notified = null;

			target.keyPress.subscribe({
				update : function(result) {
					notified = result;
				},
				cancel : function(result) {
				}
			});

			target.keyPress.publish('test');
			expect(notified).toBe('test');
			delete target.performs.action.keyPress._subscribers;
		});

		it('should notify subscribers with results of object types', function() {
			var notified = null;

			target.keyPress.subscribe({
				update : function(result) {
					notified = result;
				},
				cancel : function(result) {
				}
			});

			target.keyPress.publish({ test : 123 });
			expect(notified.test).toBe(123);
			delete target.performs.action.keyPress._subscribers;
		});

		it('should notify subscribers with results generated by passed in functions', function() {
			var notified = null;
			target.keyPress.subscribe({update:function(result){notified=result;},cancel:function(result){}});
			target.keyPress.publish(function(){return 123;});
			expect(notified).toBe(123);
			delete target.keyPress._subscribers;
		});
	});
});

