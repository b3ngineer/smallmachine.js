;(function(sm) {
    sm.addMessageType('Hook', function(targetObject, contextObject) {
        this.target = targetObject;
        this.context = contextObject;
        return this;
    });

    var hookHelper = function(targetObject, contextObject, asyncResult) {
        var hookObject = new sm.types.Hook(targetObject, contextObject);
        return hookObject;
    };

    sm.system.insert.addHelper('hook', hookHelper);
}(smallmachine));
