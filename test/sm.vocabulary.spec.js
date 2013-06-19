describe('sm.vocabulary', function() {

	it('should add the "user" term to the core channel', function() {
		expect(sm.channels.user).toBeDefined();
	});

	it('should add the "click" term to the "user" term', function() {
		expect(sm.channels.user.click).toBeDefined();
	});

	it('should add the "system" term to the core channel', function() {
		expect(sm.channels.system).toBeDefined();
	});

	it('should add the "click" term to the "system" term', function() {
		expect(sm.channels.system.click).toBeDefined();
	});

	it('should notify system.click subscribers when user.click is published to', function() {
		var notified = false;
		sm.channels.system.click.subscribe({
			update : function(message) {
				notified = true;
			},
			cancel : function(message) {
			}
		});

		sm.channels.user.click.publish("test123");
		expect(notified).toBe(true);
	});

});

