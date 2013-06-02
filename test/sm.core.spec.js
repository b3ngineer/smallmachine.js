describe('sm.core', function() {

	it('should initialize the channels membership in the core module', function() {
		expect(sm.channels).toBeDefined();
	});

	it('should initialize the channels membership root with the ".add" prototype method', function() {
		expect(sm.channels.extend).toBeDefined();
	});

	it('should allow members to be added to the channels membership', function() {
		sm.channels.extend('test1');
		expect(sm.channels.test1).toBeDefined();
	});

	it('should add Channel types to memberships defined by Channel types', function() {
		sm.channels.extend('test2');
		expect(sm.channels.test2._subscribers).toBeDefined();
		expect(sm.channels.test2.join).toBeDefined();
		expect(sm.channels.test2.extend).toBeDefined();
		expect(sm.channels.test2.subscribe).toBeDefined();
		expect(sm.channels.test2.publish).toBeDefined();
	});

	it('should add Subcomponent types to memberships defined by Subcomponent types', function() {
		sm.subcomponents.extend('test3');
		expect(sm.subcomponents.test3._subscribers).not.toBeDefined();
		expect(sm.subcomponents.test3.join).toBeDefined();
		expect(sm.subcomponents.test3.extend).toBeDefined();
		expect(sm.subcomponents.test3.publish).not.toBeDefined();
		expect(sm.subcomponents.test3.subscribe).not.toBeDefined();
	});
});

