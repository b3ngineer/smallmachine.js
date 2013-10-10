;(function(sm) {
    'use strict';

	var Channel = function(value, type) {
        this._value = value;
        this._type = type;
		return this;
	};
    
	Channel.prototype.forward = function(message, recipients) {
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

	Channel.prototype.subscribe = function(subscriber) {
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

	Channel.prototype.notify = function(message, subscribers) {
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
			else if (response && typeof response.update === 'function') {
				delegates.push(response);
			}
		}
		if (authoritative) {
			var continuedAuthority = false;
			for (var i = 0; i < deference.length; i++) {
				var deferredResult = deference[i](message);
				if (!deferredResult === false) {
					continuedAuthority = true;
				}
			}
			if (continuedAuthority === false) {
				authoritative = false;
			}
		}
		if (authoritative == false) {
			if (delegates.length > 0) {
				this.notify(message, delegates);
			}
		}
	};

	Channel.prototype.publish = function(message, recipients) {
		if (typeof this === 'undefined') {
			throw new Error('holy fucking shit');
		}
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

	Channel.prototype.addHelper = function(name, helper) {
		var method = Channel.prototype.publish;
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

	Channel.prototype.getType = function() {
		return '[object Channel]';
	};

	Channel.prototype.ofType = function(type) {
		return (type === 'Channel' || (typeof type.getType === 'function' && type.getType() === this.getType()));
	};

	sm.behavior.extendedBy(Channel, 'Channel');
}(smallmachine));
