describe('sm.channels', function() {

	describe('message types', function() {
        it('should allow comparing instanceof AsyncResult from modules outside of core', function() {
			var channel = new smallmachine.behavior.Channel();
            var test = new smallmachine.type.AsyncResult(channel);
            expect(test instanceof smallmachine.type.AsyncResult).toBe(true);
        });
	});

	describe('publish politics', function() {
		it ('should not notify a delegate if a subscriber claims authority', function() {
			var value = false;
			target.user.click.subscribe(function(message) { return { update : function(message){ value = message; } } });
			target.user.click.subscribe(function(message) { return true; });
			target.user.click.publish(true);
			expect(value).toBe(false);
			delete target.user.click._subscribers;
		});
	});

	describe('publishing to concepts', function() {
		it('should notify user.click if action is published to', function() {
			var value = false;
			target.user.click.subscribe({ update : function(message){ value = message; } });
			target.action.publish(true);
			expect(value).toBe(true);
			delete target.user.click._subscribers;
		});
	});

    describe('publishing to relationships', function() {
        it('should notify subscribers to user.performs when any action is published to', function() {
            var notified = null;
            target.user.performs.subscribe({ update : function(result) { notified = result; }, cancel : function(result) { } }); 
            target.keyPress.publish(function(){ return 123; });
            expect(notified).toBe(123);
			delete target.user.performs._subscribers;
        });

        it('should not notify subscribers to user.performs when any task is published to', function() {
            var notified = 0;
            target.user.performs.subscribe({update:function(r){notified++;},cancel:function(r){}});
            target.system.get.publish(function(){return 123;});
            expect(notified).toBe(0);
			delete target.user.performs._subscribers;
        });

        it('should notify subscribers to system.reactsTo when any action is published to', function() {
            var notified = null;
            target.system.reactsTo.subscribe({
                update : function(result) {
                    notified = result;
                },
                cancel : function(result) {
                }
            });
            target.keyPress.publish(function(){ return 123; });
            expect(notified).toBe(123);
			delete target.system.reactsTo._subscribers;
        });

        it('should notify subscribers to target.performs when any action or task is published to', function() {
            var notified = 0;
            target.performs.subscribe({ update : function(result) { notified++; }, cancel : function(result) { } });
            target.user.keyPress.publish(function(){ return 123; });
            target.system.get.publish(function(){ return 123; });
            expect(notified).toBe(2);
			delete target.performs._subscribers;
        });
    });

	describe('subscriptions', function() {
		it('should add a NamedValueCollection to a model', function() {
			expect(target.memory).toBeDefined();
		});

		it('should add named values to memory when calling set', function() {
			var actual = new smallmachine.type.NamedValue('test', '123', true);
			target.set.publish(actual);
			expect(target.memory._collection.test).toBeDefined();
			expect(target.memory._collection.test['123']).toBeDefined();
		});

		it('should be able to check for the existence of a named value after calling set', function() {
			var actual = new smallmachine.type.NamedValue('test2', '1234', true);
			target.set.publish(actual);
			expect(target.memory.exists('test2', '1234')).toBe(true);
		});

		it('should update a NamedValue when publishing to get', function() {
			var actual = new smallmachine.type.NamedValue('test3', 'a', true);
			target.set.publish(actual);
			expect(target.memory.exists('test3', 'a')).toBe(true);
			var testData = new smallmachine.type.NamedValue('test3', 'a', false);
			target.get.publish(testData);
			expect(testData.value).toBe(true);
		});

		it('should use default value of a NamedValue when publishing to get', function() {
			var actual = new smallmachine.type.NamedValue('test4', 'a', true);
			target.set.publish(actual);
			expect(target.memory.exists('test4', 'a')).toBe(true);
			var testData = new smallmachine.type.NamedValue('test4', 'b', false);
			target.get.publish(testData);
			expect(testData.value).toBe(false);
		});

		it('should remove subscribers when calling unsubscribe', function() {
			var actual = target.system.initialize.subscribe(function(message){});	
			expect(target.system.initialize._subscribers[actual]).toBeDefined();
			target.system.initialize.unsubscribe(actual);
			expect(target.system.initialize._subscribers[actual]).not.toBeDefined();
		});

		it('should remove subscribers when their lifetime reaches 0', function() {
			var actual = target.system.initialize.subscribe({
				update : function(message){
					this.lifetime = 0;
				}
			});	
			expect(target.system.initialize._subscribers[actual]).toBeDefined();
			target.system.initialize.publish('test');
			expect(target.system.initialize._subscribers[actual]).not.toBeDefined();
		});

		it('should subscribe #test1 and #test2 using the jQuery extension', function() {
			var hit1 = false, hit2 = false;
			jQuery('#test1').subscribe(target.system, function(message) { hit1 = this.id; });
			jQuery('#test2').subscribe(target.system, function(message) { hit2 = this.id; });
			target.system.publish(true);
			expect(hit1).toBe('test1');
			expect(hit2).toBe('test2');
		});
	});
});
