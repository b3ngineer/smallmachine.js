;var sm = (function(core) {
	'use strict';

	Function.prototype.alsoBehavesLike = function(something) {
		for (var p in something.prototype) {
			if (p.indexOf('_') == 0) {
				continue;
			}
			this.prototype[p] = something.prototype[p];
		}
		for (var p in something) {
			if (!something.hasOwnProperty(p)) {
				continue;
			}
			if (p.indexOf('_') == 0) {
				continue;
			}
			this.prototype[p] = something[p];
		}
	}

	core.CONCEPT = 'concept';
	core.RELATIONSHIP = 'relationship';

    core.AsyncResult = function(channel) {
        this._type = 'AsyncResult';
        this._channel = channel;
        return this;
    };

    core.AsyncResult.prototype.publish = function(result, recipients) {
        this._channel.publish(result, recipients);
    };

	var Channel = function() {
	 	this.forward = function(result, recipients) {
			throw new Error('Missing implementation of forward'); 
		};
		return this;
	};

	Channel.prototype.subscribe = function(subscriber) {
		if (typeof this._subscribers === 'undefined') {
			this._subscribers = [];
		}
		if (typeof subscriber.update !== 'function') {
			throw new Error('A subscriber must implement update(result)');
		}
		if (typeof subscriber.cancel !== 'function') {
			throw new Error('A subscriber must implement cancel(result)');
		}
		this._subscribers.push(subscriber);
		return this;
	};

	Channel.prototype.publish = function(result, recipients) {
		var recipients = recipients || { };
        if (typeof result === 'function') {
            var newResult = result(new core.AsyncResult(this));
            result = newResult;
            if (typeof result !== 'undefined' &&
                typeof result._type !== 'undefined' &&
                result._type === 'AsyncResult') {
                return this;
            }
        }
		if (typeof this._subscribers === 'undefined') {
			this.forward(result, recipients);
			return this;
		}
		var isCancelled = false;
		for (var i = 0; i < this._subscribers.length; i++) {
			if (!isCancelled) {
				if (this._subscribers[i].update(result) === false) {
					isCancelled = true;
				}
			}
			else {
				this._subscribers[i].cancel(result);
			}
		}
		this.forward(result, recipients);
		return this;
	};

    Channel.prototype.addHelper = function(name, helper) {
		var method = Channel.prototype.publish;
        var context = this;
        Channel.prototype.publish[name] = function() {
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

	var Rules = function() {
		this.isA = function(o) { 
			throw new Error('Missing implementation for isA');	
		};
		this.hasRange = function(o) { 
			throw new Error('Missing implementation for hasRange');	
		};
		this.hasDomain = function(o) { 
			throw new Error('Missing implementation for hasDomain');	
		};
		this.relatesTo = function(p, o) { 
			throw new Error('Missing implementation for relatesTo');	
		};
		return this;
	};

	core.Term = function(value) {
        if (typeof value._value !== 'undefined' && typeof value._type !== 'undefined') {
            this._value = value._value;
            this._type = value._type;
        }
        else {
            this._value = value;
            this._type = null;
        }

		this.forward = function(result, recipients) {
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
					this[property].publish(result, recipients);
				}
			};
		};
	};

	core.add = function(Term) {
		core[Term._value] = Term;
		return Term;
	};

	core.Term.prototype.relatesTo = function(TermA, TermB) {
		if (TermA._type === core.CONCEPT) {
			throw new Error('Cannot define a relationship with a concept type: ' + TermA._value);
		}
		else if (TermA._type === null) {
			TermA._type = core.RELATIONSHIP;
		}

		if (TermB._type === core.RELATIONSHIP) {
			throw new Error('Cannot create a relationship with a relationship type: ' + TermB._value);
		}
		else if (TermB._type === null) {
			TermB._type = core.CONCEPT;
		}

		if (this._type === core.RELATIONSHIP) {
			throw new Error('Cannot create a relationship from a relationship type: ' + this._value);
		}
		else if (this._type === null) {
			this._type = core.CONCEPT;
		}

		core[this._value][TermA._value] = new core.Term(TermA);
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
	core.Term.prototype.isA = function(Term) {
		if (Term._type === core.RELATIONSHIP) {
			throw new Error('Cannot apply isA to a relationship type: ' + Term._value);
		}
		else if (Term._type === null) {
			Term._type = core.CONCEPT;
		}
		if (this._type === core.RELATIONSHIP) {
			throw new Error('Cannot apply isA to a relationship type: ' + this._value);
		}
		else if (this._type === null) {
			this._type = core.CONCEPT;
		}
		core[Term._value][this._value] = this;
		return this;
	};

	// object property range
	core.Term.prototype.hasRange = function(Term) {
		if (Term._type === core.RELATIONSHIP) {
			throw new Error('Cannot apply hasRange to a relationship type: ' + Term._value);
		}
		else if (Term._type === null) {
			Term._type = core.CONCEPT;
		}
		if (this._type === core.CONCEPT) {
			throw new Error('Cannot assign hasRange from a concept type: ' + this._value);
		}
		else if (this._type === null) {
			this._type = core.RELATIONSHIP;
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
	core.Term.prototype.hasDomain = function(Term) {
		if (Term._type === core.RELATIONSHIP) {
			throw new Error('Cannot apply hasRange to a relationship type: ' + Term._value);
		}
		else if (Term._type === null) {
			Term._type = core.CONCEPT;
		}
		if (this._type === core.CONCEPT) {
			throw new Error('Cannot assign hasRange from a concept type: ' + this._value);
		}
		else if (this._type === null) {
			this._type = core.RELATIONSHIP;
		}
		core[Term._value][this._value] = this;
		return this;
	};

	core.Term.alsoBehavesLike(Channel);
	core.Term.alsoBehavesLike(Rules);
	return core;
}(sm || {}));

