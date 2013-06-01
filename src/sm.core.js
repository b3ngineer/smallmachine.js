;var sm = (function(module) {
	'use strict';

	module.guid = function() {
		return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
			var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
			return v.toString(16);
		});
	};

	var Channel = function() {
		this.subscribers = [];
	};

	Channel.prototype.publish = function(message) {
		var cancel = false;

		for (var i = 0; i < this.subscribers.length; i++) {
			if (cancel === true) {
				this.subscribers[i].subscriber.cancel(message);
			}
			else if (this.subscribers[i].subscriber.update(message) === false) {
				cancel = true;
			}
		}
		
		return this;
	};

	Channel.prototype.subscribe = function(subscriber) {
		if (typeof subscriber.update != 'function') {
			throw new Error('A supplied subscriber object must implement an "update" method');
		}

		if (typeof subscriber.cancel != 'function') {
			throw new Error('A supplied subscriber object must implement an "cancel" method');
		}

		this.subscribers.push(subscriber);
	}

	Channel.prototype.add = function(name) {
		if (this[name]) {
			throw new Error('There is a name conflict on the specified channel: ' + name);
		}
		this[name] = new Channel();
		return this[name];
	}

	Channel.prototype.join = function(channel) {
		if (typeof channel == 'undefined') {
			throw new Error('A valid channel must be passed to method Channel.join');
		}
		this.subscribe({
			update : function(message) { channel.publish(message); },
			cancel : function(message) { } });
	}

	module.channels = new Channel();

	return module;
}(sm || {}));
