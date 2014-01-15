;(function(sm, $) {
    'use strict';

	function ChannelExtension(a) {
		if (typeof $.fn !== 'undefined') {
			$.fn.subscribe = function(channel,fn) {
				return this.each(function() {
					var element = this, callback = fn;
					channel.subscribe(function(message){
						callback.apply(element,[message]);
					});	
				});
			}
		}
		return this;
	};

	ChannelExtension.prototype._name = 'ChannelExtension';

	ChannelExtension.prototype.initializer = true;

	sm.behavior.extendedBy(ChannelExtension);
}(smallmachine, jQuery || {}));
