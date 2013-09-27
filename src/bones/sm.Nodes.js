;(function(sm, $, raphael) {
	'use strict';

	var Guid = {
		generate : function() {
			return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
				var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
				return v.toString(16);
			});
		}
	};

	sm.addMessageType('Block', function(params, $text) {
		if (typeof params.getType === 'function' && params.getType() === '[object KeyPressEvent]') {
			params.id = Guid.generate();
			if (typeof $text !== 'undefined') {
				var position = $text.position();
				params.x = position.left;
				params.y = position.top;
				params.width = $text.width();
				params.height = $text.height();
				params.text = $text.val();
			}
		}
		this.id = params.id;
		this.x = params.x;
		this.y = params.y;
		this.height = params.height;
		this.width = params.width;
		this.text = params.text || '';
		return this;
	});

	sm.addMessageType('CanvasEvent', function(e, context, $text) {
		this.x = e.offsetX || e.pageX;
		this.y = e.offsetY || e.offsetY;
		this.context = context;
		this.$text = $text;
		return this;
	});

	sm.system.initialize.subscribe({
		update : function(message) {
			var width = $(window).width();
			var height = $(window).height();
			var paper = raphael('paper', width, height);
			var $text = $('<textarea id="text" style="position:absolute;"></textarea>').hide();
			$('body').append($text);
			$text.keypress(function(e) {
				if (e.keyCode == 13) {
					e.getType = function() { return '[object KeyPressEvent]'; }
					var block = new sm.types.Block(e, $text);
					sm.system.insert.hook(block, paper);
					$text.hide();
				}
			});
			$('#paper').click(function(e) { sm.user.click.publish(new sm.types.CanvasEvent(e, paper, $text)); });
			sm.system.reactsTo.click.subscribe({ update : function(message) { return defaultNewText; } }); 
			sm.system.insert.subscribe({ update : function(message) { return defaultBlocks; } });
			for (var i = 0; i < message.length; i++) {
				var block = new sm.types.Block(message[i]);
				sm.system.insert.hook(block, paper);
			}
		}
	});

	var defaultNewText = {
		update : function(message) {
			if (!message instanceof sm.types.CanvasEvent) {
				return false;
			}
			message.$text.css({top:message.y + 'px',left:message.x + 'px'}).show().select();
		}
	}

	var defaultBlocks = {
		update : function(message) {
			if (!message instanceof sm.types.Hook) {
				return false;
			}
			var block = message.target;
			var paper = message.context;
			var rect = paper.rect(block.x, block.y, block.width, block.height, 3);
			rect.node.id = block.id;
			// TODO: figure out how to position the text vertically
			var text = paper.text(block.x + 5, block.y + 10, block.text).attr({
				'text-anchor': 'start',
				'font-size': 15
			});
		}
	};

	return true;
})(smallmachine, jQuery, Raphael);
