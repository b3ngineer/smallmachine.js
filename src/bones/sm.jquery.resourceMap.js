;(function(module, $) {
	'use strict';

	function updateData() {
	};

	var resourceMapClickEventSink = {
		update : function(message) {
		},
		cancel : function(message) {
		}
	};

	sm.channels.system.click.subscribe(resourceMapClickEventSink);
	
	return true;	
}(sm, jQuery));
