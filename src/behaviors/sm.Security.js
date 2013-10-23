;(function(sm) {
    'use strict';

	var Security = function() {
		return this;
	};	

	Security.prototype._name = 'Security';

	sm.behavior.extendedBy(Security);
}(smallmachine));
