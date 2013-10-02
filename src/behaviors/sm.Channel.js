;(function(sm) {
    'use strict';

	sm.Channel = function(value, type) {
        this._value = value;
        this._type = type;
		return this;
	};
    
	sm.Channel.prototype.forward = function(message, recipients) {
		if (this._value != null) {
			recipients[this._value] = true;
		}
		for (var property in this) {
			if (!this.hasOwnProperty(property)) {
				continue;
			}
			if (typeof this[property] === 'function' || property.indexOf('_') === 0) {
				continue;
			}
			if (recipients[property] === true) {
				continue;
			}
			if (typeof this[property].publish === 'function') {
				recipients[property] = true;
				this[property].publish(message, recipients);
			}
		}
		if (typeof this._relatesTo !== 'undefined') {
			for (var i = 0; i < this._relatesTo.length; i++) {
				if (typeof this._relatesTo[i]._subscribers === 'undefined') {
					continue;
				}
				// Relationships do *not* continue to notify their object properties when being forwarded to
				this.notify(message, this._relatesTo[i]._subscribers);
			}
		}
	};

	sm.Channel.prototype.subscribe = function(subscriber) {
		if (typeof this._subscribers === 'undefined') {
			this._subscribers = [];
		}
		if (typeof subscriber === 'function') {
			this._subscribers.push({
				update : subscriber
			});
			return this;
		}
		this._subscribers.push(subscriber);
		return this;
	};

	sm.Channel.prototype.notify = function(message, subscribers) {
		var authoritative = false,
			delegates = [],
			deference = [];
		for (var i = 0; i < subscribers.length; i++) {
			var response = subscribers[i].update(message);
			if (response === true) {
				authoritative = true;
			}
			else if (typeof response === 'function') {
				deference.push(response);
				authoritative = true;
			}
			else if (typeof response === 'object' && typeof response.update === 'function') {
				delegates.push(response);
			}
		}
		if (authoritative) {
			for (var i = 0; i < deference.length; i++) {
				deference[i](message);
			}
		}
		else {
			if (delegates.length > 0) {
				this.notify(message, delegates);
			}
			/*
			for (var i = 0; i < delegates.length; i++) {
				delegates[i](message);
			}
			*/
		}
	};

	sm.Channel.prototype.publish = function(message, recipients) {
		var recipients = recipients || { };
		if (typeof message === 'function') {
			var newResult = message(new sm.type.AsyncResult(this));
			message = newResult;
			if (typeof message !== 'undefined' &&
				typeof message.getType === 'function' &&
				message.getType() === '[object AsyncResult]') {
				return this;
			}
		}
		if (typeof this._subscribers === 'undefined') {
			this.forward(message, recipients);
			return this;
		}
		this.notify(message, this._subscribers);
		this.forward(message, recipients);
		return this;
	};

	sm.Channel.prototype.addHelper = function(name, helper) {
		var method = sm.Channel.prototype.publish;
		var context = this; // context becomes static to the channel adding the helper
		this[name] = function() {
			var args = [];
			for (var i = 0; i < arguments.length; i++) {
				args.push(arguments[i]);
			}
			return method.apply(context, [function(asyncResult) {
				args.push(asyncResult);
				return helper.apply(context, args);
			}]);
		};
		return this;
	};

	sm.Channel.prototype.getType = function() {
		return '[object Channel]';
	};
}(smallmachine));
