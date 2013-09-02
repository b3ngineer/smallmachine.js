;(function(sm) {
    function Hook(targetObject, contextObject) {
        this.target = targetObject;
        this.context = contextObject;
        return this;
    };

    Hook.prototype.getType = function() {
        return '[object Hook]';
    };

    var hookHelper = function(targetObject, contextObject, asyncResult) {
        var hookObject = new Hook(targetObject, contextObject);
        return hookObject;
    };

    sm.system.insert.addHelper('hook', hookHelper);
}(smallmachine));
