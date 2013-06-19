;var sm = (function(module) {
	'use strict';

	module.guid = function() {
		return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
			var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
			return v.toString(16);
		});
	};

	var Membership = function() {
		this._extend = function(){ return new Membership(); }
		return this;
	};

	Membership.prototype.extend = function(name) {
		if (this[name]) {
			throw new Error('There is a name conflict adding the specified memberhsip: ' + name);
		}
		this[name] = this._extend();
		return this[name];
	};

	Membership.prototype.join = function(member) {
		if (typeof this._joiners == 'undefined') {
			this._joiners = [];
		}
		this._joiners.push(member);
		return this;
	};

	var Channel = function() {
		this._subscribers = [];
		this._extend = function() { return new Channel(); }
		return this;
	};

	Channel.prototype = {
		join : Membership.prototype.join,
		extend : Membership.prototype.extend,
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
		publish : function(message, isCancelled) {
			var cancel = (typeof isCancelled == 'undefined') ? false : isCancelled;

			for (var i = 0; i < this._subscribers.length; i++) {
				if (cancel === true) {
					this._subscribers[i].cancel(message);
				}
				else if (this._subscribers[i].update(message) === false) {
					cancel = true;
				}
			}

			if (typeof this._joiners == 'undefined') {
				return this;
			}

			for (var i = 0; i < this._joiners.length; i++) {
				if (typeof this._joiners[i].publish == 'function') {
					this._joiners[i].publish(message, cancel);
				}
			}

			return this;
		}
	};

	module.channels = new Channel();

	return module;
}(sm || {}));
