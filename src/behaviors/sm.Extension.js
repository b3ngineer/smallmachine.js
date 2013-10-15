;(function(sm, $) {
    'use strict';

	var Extension = function(a) {
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
