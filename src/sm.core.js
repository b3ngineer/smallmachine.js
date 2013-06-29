;var sm = (function(core) {
	'use strict';

	Function.prototype._sm_curry = function() {
		if (arguments.length < 1) {
			return this;
		}
		var __method = this;
		var args = toArray(arguments);
		return function() {
			return __method.apply(this, args.concat(toArray(arguments)));
		}
	}

	var CONCEPT = "concept";
	var RELATIONSHIP = "relationship";

	core.Guid = function() {
		return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
			var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
			return v.toString(16);
		});
	};

	core.Message = function() {
		this.id = new core.Guid();
		return this;
	};

	var Channel = function() {
		return this;
	};

	Channel.prototype._subscribe = function(subscriber) {
		if (typeof this._subscribers === 'undefined') {
			this._subscribers = [];
		}
		if (typeof subscriber.update !== 'function') {
			throw new Error("A subscriber must implement update(Message)");
		}
		if (typeof subscriber.cancel !== 'function') {
			throw new Error("A subscriber must implement cancel(Message)");
		}
		this._subscribers.push(subscriber);
		return this;
	};

	Channel.prototype._publish = function(Message) {
		if (typeof this._subscribers === 'undefined') {
			return;
		}
		var isCancelled = false;
		for (var i = 0; i < this._subscribers.length; i++) {
			if (!isCancelled) {
				if (this._subscribers[i].update(Message) === false) {
					isCancelled = true;
				}
			}
			else {
				this._subscribers[i].cancel(Message);
			}
		}
		return this;
	};

	var Rules = function() {
		this._value = null;
		return this;
	};

	Rules.prototype = Channel.prototype;

	core.Term = function(value) {
		this._value = value;
		this._type = null;
		return this;
	};

	core.Term.prototype = Rules.prototype;

	core._add = function(Term) {
		core[Term._value] = Term;
		return Term;
	};

	Rules.prototype._hasProperty = function(TermA, TermB) {
		if (TermA._type === CONCEPT) {
			throw new Error("Cannot define a relationship with a concept type: " + TermA._value);
		}
		else if (TermA._type === null) {
			TermA._type = RELATIONSHIP;
		}

		if (TermB._type === RELATIONSHIP) {
			throw new Error("Cannot create a relationship with a relationship type: " + TermB._value);
		}
		else if (TermB._type === null) {
			TermB._type = CONCEPT;
		}

		if (this._type === RELATIONSHIP) {
			throw new Error("Cannot create a relationship from a relationship type: " + this._value);
		}
		else if (this._type === null) {
			this._type = CONCEPT;
		}

		core[this._value][TermA._value] = new core.Term(TermA._value);
		core[this._value][TermA._value][TermB._value] = TermB;

		for (var field in TermB) {
			if (!TermB.hasOwnProperty(field)) {
				continue;
			}
			if (typeof TermB[field] === 'function' || field.indexOf('_') === 0) {
				continue;
			}
			if (typeof TermB[field]._value === 'undefined') {
				continue;
			}
			core[this._value][TermA._value][field] = TermB[field];
		};

		return this;
	};

	// subsumption
	Rules.prototype._isA = function(Term) {
		if (Term._type === RELATIONSHIP) {
			throw new Error("Cannot apply isA to a relationship type: " + Term._value);
		}
		else if (Term._type === null) {
			Term._type = CONCEPT;
		}

		if (this._type === RELATIONSHIP) {
			throw new Error("Cannot apply isA to a relationship type: " + this._value);
		}
		else if (this._type === null) {
			this._type = CONCEPT;
		}

		core[Term._value][this._value] = this;
		return this;
	};

	// object property range
	Rules.prototype._hasRange = function(Term) {
		if (Term._type === RELATIONSHIP) {
			throw new Error("Cannot apply hasRange to a relationship type: " + Term._value);
		}
		else if (Term._type === null) {
			Term._type = CONCEPT;
		}

		if (this._type === CONCEPT) {
			throw new Error("Cannot assign hasRange from a concept type: " + this._value);
		}
		else if (Term._type === null) {
			Term._type = RELATIONSHIP;
		}

		core[this._value][Term._value] = Term;

		for (var field in Term) {
			if (!Term.hasOwnProperty(field)) {
				continue;
			}
			if (typeof Term[field] === 'function' || field.indexOf('_') === 0) {
				continue;
			}
			if (typeof Term[field]._value === 'undefined') {
				continue;
			}
			core[this._value][Term[field]._value] = Term[field];
		};

		return this;
	};

	// object property domain
	Rules.prototype._hasDomain = function(Term) {
		if (Term._type === RELATIONSHIP) {
			throw new Error("Cannot apply hasDomain to a relationship type: " + Term._value);
		}
		else if (Term._type === null) {
			Term._type = CONCEPT;
		}

		if (this._type === CONCEPT) {
			throw new Error("Cannot assign hasDomain from a concept type: " + this._value);
		}
		else if (Term._type === null) {
			Term._type = RELATIONSHIP;
		}

		core[Term._value][this._value] = this;
		return this;
	};

	//rule based implementation of subscribe
	Rules.prototype.subscribe = function(subscriber) {
		this._subscribe(subscriber);
		return this;
	};

	//rule based implementation of publish 
	Rules.prototype.publish = function(Message, recipients) {
		var recipients = recipients || { };
		this._publish(Message);

		if (this._value != null) {
			recipients[this._value] = true;
		}

		for (var property in this) {
			if (!this.hasOwnProperty(property)) {
				continue;
			}
			if (typeof this[property] === 'function' || property.indexOf("_") === 0) {
				continue;
			}
			if (recipients[property] === true) {
				continue;
			}
			if (typeof this[property].publish === 'function') {
				recipients[property] = true;
				this[property].publish(Message, recipients);
			}
		};

		return this;
	};

	return core;
}(sm || {}));

