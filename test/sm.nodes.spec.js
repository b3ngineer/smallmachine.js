describe('ontologies/sm.nodes', function() {
    it('should allow calling publish directly', function() {
        expect(typeof target.system.initialize.publish).toBe('function');
    });
});
