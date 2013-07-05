describe('sm.helpers', function() {
    it('should allow calling publish directly', function() {
        expect(typeof sm.system.publish).toBe('function');
    });

    it('should define the ajax helper as a child of publish', function() {
        expect(sm.system.publish.ajax).toBeDefined();
    });

    it('should allow calling ajax helper', function() {
        expect(typeof sm.system.publish.ajax).toBe('function');
    });
});
