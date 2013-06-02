;var sm = (function(module) {
	'use strict';

	module.guid = function() {
		return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
			var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
			return v.toString(16);
		});
	};

	var Channel = function() {
		this._joiners = [];
		this._subscribers = [];
		return this;
	};

	Channel.prototype = {
		subscribe : function(subscriber) {
			if (typeof subscriber.update != 'function') {
				throw new Error('A supplied subscriber object must implement an "update" method');
			}

			if (typeof subscriber.cancel != 'function') {
				throw new Error('A supplied subscriber object must implement an "cancel" method');
			}

			this._subscribers.push(subscriber);
			return this;
		},
		extend : function(name) {
			if (this[name]) {
				throw new Error('There is a name conflict adding the specified memberhsip: ' + name);
			}
			this[name] = new Channel();
			return this[name];
		},
		publish : function(message, isCancelled) {
			var cancel = (typeof isCancelled = 'undefined') ? false : isCancelled;

			for (var i = 0; i < this._subscribers.length; i++) {
				if (cancel === true) {
					this._subscribers[i].subscriber.cancel(message);
				}
				else if (this._subscribers[i].subscriber.update(message) === false) {
					cancel = true;
				}
			}

			for (var i = 0; i < this._joiners.length; i++) {
				if (typeof this._joiners[i].publish == 'function') {
					this._joiners[i].publish(message, cancel);
				}
			}

			return this;
		},
		join : function(member) {
			this._joiners.push(member);
			return this;
		}
	};

	module.channels = new Channel();

	var Subcomponent = function() {
		this._joiners = [];
		return this;
	};

	Subcomponent.prototype =  {
		extend : function(name) {
			if (this[name]) {
				throw new Error('There is a name conflict adding the specified memberhsip: ' + name);
			}
			this[name] = new Subcomponent();
			return this[name];
		},
		join : function(member) {
			this._joiners.push(member);
			return this;
		}
	};

	module.subcomponents = new Subcomponent();
	return module;
}(sm || {}));
