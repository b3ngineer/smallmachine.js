;(function(module, $) {
	'use strict';

	$.fn.sm = function(options) {
		var settings = $.extend({ }, options);
        return this.each(function() {
			var container = $(this);
			container.click(function(e) { module.channels.user.click.send(e); });
        });
    };
}(sm, jQuery));
