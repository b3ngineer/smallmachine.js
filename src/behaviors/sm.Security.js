;(function(sm) {
    'use strict';

	var Security = function() {
		return this;
	};	

	Security.prototype.getType = function() {
		return '[object Security]';
	};

	Security.prototype.ofType = function(type) {
		return (type === 'Security' || (typeof type.getType === 'function' && type.getType() === this.getType()));
	};

	sm.behavior.extendedBy(Security, 'Security');
}(smallmachine));
