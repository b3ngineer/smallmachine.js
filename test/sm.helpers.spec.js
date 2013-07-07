describe('sm.helpers', function() {
    it('should allow calling publish directly', function() {
        expect(typeof sm.system.publish).toBe('function');
    });

    it('should define the json helper as a child of publish', function() {
        expect(sm.system.publish.json).toBeDefined();
    });

    it('should allow calling json helper to get results asynchronously', function() {
        sm.system.subscribe({
            update : function(e) {
                // TODO: make this test work async
                console.log(e);
            },
            cancel : function(e) {
                expect(true).toBe(false);
            }
        });
        sm.system.publish.json('test.service.php');
    });
});
