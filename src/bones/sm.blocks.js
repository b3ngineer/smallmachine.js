;(function(sm, $, raphael) {
	'use strict';

	sm.system.initialize.subscribe({
		update : function(message) {
           var width = $(window).width();
           var height = $(window).height();
           var paper = raphael('paper', width, height);  
           for (var i = 0; i < message.length; i++) {
               var block = message[i];
               sm.system.insert.hook(block, paper);
           }
		}
	});

    // create delegate to handle non authoritative responses
    sm.system.insert.subscribe({
        update : function(message) {
            return defaultBlocks;
        }
    });

    var defaultBlocks = {
        update : function(message) {
            if (typeof message.getType === 'function' && message.getType() !== '[object Hook]') {
                return false;
            }
            var paper = message.context;
            var block = message.target;
            paper.rect(block.x, block.y, block.w, block.h, 3);
        }
    };

	return true;
}(smallmachine, jQuery, Raphael));
