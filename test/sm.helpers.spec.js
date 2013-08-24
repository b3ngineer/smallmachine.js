describe('sm.helpers', function() {
    it('should allow calling publish directly', function() {
        expect(typeof sm.system.initialize.publish).toBe('function');
    });

    it('should define the json helper as a child of system.initialize', function() {
        expect(sm.system.initialize.json).toBeDefined();
    });

    it('should not define the json helper as a child of system', function() {
        expect(sm.system.json).not.toBeDefined();
    });

    it('should allow calling json helper to get results asynchronously', function() {
        var updated = false;
        sm.system.initialize.subscribe({
            update : function(e) {
                updated = true;
            },
            cancel : function(e) {
                expect(true).toBe(false);
            }
        });
        sm.system.initialize.json('test.service.php');
        waitsFor(function() {
            return updated;
        }, "Failed to return on system.initialize", 1000);
    });
    
    it('should not notify inappropriate channels while making requests asynchronously', function() {
        runs(function(){
            this.updated = { result : false };
            this.updatedIncorrectly = { result : false };
            var u1 = this.updated;
            var u2 = this.updatedIncorrectly;
            sm.system.initialize.subscribe({
                update : function(e) {
                    u1.result = true;
                },
                cancel : function(e) {
                    expect(true).toBe(false);
                }
            });
            sm.messenger.error.subscribe({
                update : function(e) {
                    u2.result = true;
                },
                cancel : function(e) {
                    expect(true).toBe(false);
                }
            });
            sm.system.initialize.json('test.service.php');
        });
        waits(1000);
        runs(function() {
            expect(this.updated.result && !this.updatedIncorrectly.result).toBe(true);
        });
    });
});
