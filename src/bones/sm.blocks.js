;(function(sm, $, raphael) {
	'use strict';

	sm.system.initialize.subscribe({
		update : function(message) {
           var width = $(window).width();
           var height = $(window).height();
           var paper = raphael('paper', width, height);  
           for (var i = 0; i < message.length; i++) {
               var block = message[i];
               sm.system.insert.publish({'block' : block, 'paper' : paper});
           }
		}
	});
	return true;
}(smallmachine, jQuery, Raphael));
