;(function(sm, $) {
    'use strict';

	function Extension(a) {
		if (typeof $.fn !== 'undefined') {
			$.extend({
				'sm' : a
			});
		}
		return this;
	};

	Extension.prototype._name = 'Extension';

	Extension.prototype.initializer = true;

	sm.behavior.extendedBy(Extension);
}(smallmachine, jQuery || {}));
