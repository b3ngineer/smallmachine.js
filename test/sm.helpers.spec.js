describe('target.helpers', function() {
    it('should allow calling publish directly', function() {
        expect(typeof target.system.initialize.publish).toBe('function');
    });

    it('should define the json helper as a child of system.initialize', function() {
        expect(target.system.initialize.json).toBeDefined();
    });

    it('should not define the json helper as a child of system', function() {
        expect(target.system.json).not.toBeDefined();
    });

    it('should allow calling json helper to get results asynchronously', function() {
        var updated = false;
        target.system.initialize.subscribe({
            update : function(e) {
                updated = true;
            },
            cancel : function(e) {
                expect(true).toBe(false);
            }
        });
        target.system.initialize.json('test.service.php');
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
            target.system.initialize.subscribe({
                update : function(e) {
                    u1.result = true;
                },
                cancel : function(e) {
                    expect(true).toBe(false);
                }
            });
            target.messenger.error.subscribe({
                update : function(e) {
                    u2.result = true;
                },
                cancel : function(e) {
                    expect(true).toBe(false);
                }
            });
            target.system.initialize.json('test.service.php');
        });
        waits(1000);
        runs(function() {
            expect(this.updated.result && !this.updatedIncorrectly.result).toBe(true);
        });
    });

    it('should not define the Hook class in global namespace', function() {
        expect(typeof Hook).not.toBe('function');
    });
});
