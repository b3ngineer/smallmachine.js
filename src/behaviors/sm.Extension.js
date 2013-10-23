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

	Extension.prototype.initializer = true;

	sm.behavior.extendedBy(Extension, 'Extension');
}(smallmachine, jQuery || {}));
