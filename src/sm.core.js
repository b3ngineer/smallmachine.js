;var smallmachine = (function(core) {
	'use strict';

	Function.prototype.alsoBehavesLike = function(something) {
		for (var p in something.prototype) {
			// don't copy "private" members
			if (p.indexOf('_') == 0) {
				continue;
			}
			if (typeof this.prototype[p] !== 'undefined') {
				var currentBehaviorIsVirtual = this.prototype[p].prototype.virtual;
				var newBehaviorIsVirtual = something.prototype[p].prototype.virtual;

				if (currentBehaviorIsVirtual && newBehaviorIsVirtual) {
					throw new Error('Cannot mixin duplicate named virtual behaviors: ' + p);
				}
				else if (currentBehaviorIsVirtual) {
					this.prototype[p] = something.prototype[p];
                    continue;
				}
				else if (newBehaviorIsVirtual) {
					continue;
				}
				throw new Error('Cannot mixin same-named behaviors: ' + p);
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
			if (typeof this.prototype[p] !== 'undefined') {
				throw new Error('Cannot mixin same-named properties: ' + p);
			}
			this.prototype[p] = something[p];
		}
	}

    var Ontology = function() {
        return this;
    };

    Ontology.prototype.add = function(term) {
        var t = new core.Term(term);
        this[t._value] = t;
        return this;
    };

    core = function() {
        return new Ontology();
    };

	core.CONCEPT = 'concept';
	core.RELATIONSHIP = 'relationship';
	core.types = {};

	core.addMessageType = function(name, ctor) {
		if (typeof ctor !== 'function') {
			throw new Error('Cannot create a message type without a constructor (function)');
		}
		if (typeof core.types[name] !== 'undefined') {
			core.types[name].alsoBehavesLike(ctor);
		}
		else {
			core.types[name] = ctor;
			core.types[name].prototype.getType = function() {
				return '[object ' + name + ']';
			};
			core.types[name].prototype.ofType = function(type) {
				return this.getType() == '[object ' + type + ']';
			};
		}
	};

	var AsyncResult = function(channel) {
		this._channel = channel;
		return this;
	};

	AsyncResult.prototype.publish = function(message, recipients) {
		this._channel.publish(message, recipients);
		return this;
	};

	core.addMessageType('AsyncResult', AsyncResult);

	core.Term = function(value) {
		if (typeof value._value !== 'undefined' && typeof value._type !== 'undefined') {
			this._value = value._value;
			this._type = value._type;
		}
		else {
			this._value = value;
			this._type = null;
		}
		return this;
	};

	var Rules = function(value, type) {
        this._value = value;
        this._type = type;
		return this;
	};

	/* relatesTo scopes cross-cutting concerns by implicitly grouping concepts */
	Rules.prototype.relatesTo = function(TermA, TermB) {
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
		core[this._value][TermA._value] = new core.Term(TermA); // isolate relationship scope
		core[this._value][TermA._value][TermB._value] = TermB; // put object property in scope
		core[this._value][TermB._value] = TermB; // sugar for including property as child
		if (typeof TermB._relatesTo === 'undefined') {
			TermB._relatesTo = [];
		}
		TermB._relatesTo.push(core[this._value][TermA._value]);
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
			core[this._value][TermA._value][field] = TermB[field]; // link subclasses in scope
			core[this._value][field] = TermB[field]; // sugar for linking subclasses as children
			if (typeof TermB[field]._relatesTo === 'undefined') {
				TermB[field]._relatesTo = [];
			}
			TermB[field]._relatesTo.push(core[this._value][TermA._value]);
		}
		return this;
	};

	/* subsumption establishes proximal relationship to other concepts */
	Rules.prototype.isA = function(Term) {
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

	/* object property range universally relates concepts downstream from an edge */
	Rules.prototype.hasRange = function(Term) {
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
		
		if (typeof Term._relatesTo === 'undefined') {
			Term._relatesTo = [];
		}
		Term._relatesTo.push(this);
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
			if (typeof Term[field]._relatesTo === 'undefined') {
				Term[field]._relatesTo = [];
			}
			Term[field]._relatesTo.push(this);
		};
		return this;
	};

	/* object property domain universally relates concepts upstream from an edge */
	Rules.prototype.hasDomain = function(Term) {
		if (Term._type === core.RELATIONSIP) {
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

	core.Term.alsoBehavesLike(Rules);

	return core;
}(smallmachine || {}));

