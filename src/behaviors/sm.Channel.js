;(function(sm) {
    'use strict';

	function Channel(value, type) {
        this._value = value;
        this._type = type;
		return this;
	};

	Channel.prototype._name = 'Channel';
    
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

	Channel.prototype.unsubscribe = function(subscriberId) {
		if (typeof this._subscribers !== 'undefined') {
			delete this._subscribers[subscriberId];
		}
	};

	Channel.prototype.subscribe = function(subscriber) {
		if (typeof this._subscribers === 'undefined') {
			this._subscribers = {};
		}
		var subscriberId = sm.getGuid();
		if (typeof subscriber === 'function') {
			this._subscribers[subscriberId] = { update : subscriber, lifetime : 1 };
		}
		else{
			if (typeof subscriber.lifecycle === 'undefined') {
				subscriber.lifetime = 1;
			}
			this._subscribers[subscriberId] = subscriber;
		}
		return subscriberId;
	};

	Channel.prototype.notify = function(message, subscribers) {
		var authoritative = false,
			delegates = {},
			delegateCount = 0,
			deference = [];

		for (var id in subscribers) {
			var response = subscribers[id].update(message);
			if (typeof subscribers[id] === 'undefined') {
				continue;
			}
			if (subscribers[id].lifetime <= 0) {
				this.unsubscribe(id);
			}
			if (response === true) {
				authoritative = true;
			}
			else if (typeof response === 'function') {
				deference.push(response);
				authoritative = true;
			}
			else if (response && typeof response.update === 'function') {
				delegates[sm.getGuid()] = response;
				delegateCount++;
			}
		}
		if (authoritative) {
			var continuedAuthority = deference.length === 0;
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
		if (authoritative == false && delegateCount > 0) {
			this.notify(message, delegates);
		}
	};

	Channel.prototype.publish = function(message, recipients) {
		var recipients = recipients || { };
		if (typeof message === 'function') {
			var newResult = message(new sm.type.AsyncResult(this));
			message = newResult;
			if (typeof message !== 'undefined'
				&& typeof message._channel !== 'undefined'
				&& typeof message.publish === 'function') {
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

	Channel.prototype.addHelper = function(name, helper, minArgs) {
		var method = Channel.prototype.publish;
		var context = this; // context becomes static to the channel adding the helper
		this[name] = function() {
			var args = [];
			for (var i = 0; i < arguments.length; i++) {
				args.push(arguments[i]);
			}
			if (typeof minArgs !== 'undefined') {
				for (var i = 0; i < minArgs - args.length; i++) {
					args.push(null);
				}
			}
			return method.apply(context, [function(asyncResult) {
				args.push(asyncResult);
				return helper.apply(context, args);
			}]);
		};
		return this;
	};

	sm.behavior.extendedBy(Channel);
}(smallmachine));
